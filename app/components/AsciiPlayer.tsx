"use client";
import { useEffect, useRef, useState } from "react";

// map from index to ascii character
const RAMP =
	" .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const RAMP_LEN = RAMP.length - 1;

function sliceToAscii(luma: Uint8Array, W: number, H: number, offset: number) {
	let out = "";
	for (let y = 0; y < H; y++) {
		const row = offset + y * W;
		for (let x = 0; x < W; x++) {
			const L = luma[row + x];
			out += RAMP[((L / 255) * RAMP_LEN) | 0];
		}
		out += "\n";
	}
	return out;
}

export default function AsciiPlayer() {
	const preRef = useRef<HTMLPreElement>(null);
	const workerRef = useRef<Worker | null>(null);
	const [atlasMeta, setAtlasMeta] = useState<{
		luma: Uint8Array;
		W: number;
		H: number;
		N: number; // number of frames
	} | null>(null);

	// one-time spinup for the worker thread
	useEffect(() => {
		workerRef.current = new Worker(
			new URL("../../workers/gif-decoder.worker.ts", import.meta.url),
			{
				type: "module",
			}
		);
		const w = workerRef.current;

		w.onmessage = ({ data }) => {
			const { buf, width, height, frames } = data;
			setAtlasMeta({
				luma: new Uint8Array(buf),
				W: width,
				H: height,
				N: frames,
			});
		};

		fetch("/jimbo.gif")
			.then((res) => res.arrayBuffer())
			.then((buf) => workerRef.current?.postMessage(buf, [buf]));

		return () => w.terminate(); // spin down the worker thread during cleanup
	}, []);

	// rAF loop renders the atlas slice as ASCII
	useEffect(() => {
		if (!atlasMeta) return; // worker has not passed us the atlas yet

		let start = performance.now();
		const { luma, W, H, N } = atlasMeta;

		const ascii = sliceToAscii(luma, W, H, 0);
		if (preRef.current) preRef.current.textContent = ascii;

		// the frame we render depends on the amount of time that has elapsed since the start
		function loop(now: number) {
			const elapsed = now - start;
			const f = Math.floor(elapsed / 100) % N;
			const ascii = sliceToAscii(luma, W, H, f * W * H);
			if (preRef.current) preRef.current.textContent = ascii;
			requestAnimationFrame(loop);
		}
		const id = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(id);
	}, [atlasMeta]);

	return (
		<>
			<pre
				ref={preRef}
				style={{
					lineHeight: "90%",
					fontFamily: "monospace",
					fontSize: "5px",
				}}
			/>
		</>
	);
}
