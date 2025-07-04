/// <reference lib="webworker" />

import { parseGIF, decompressFrames, ParsedGif } from "gifuct-js";

function rgbToLuma(r: number, g: number, b: number) {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getBgColor(gif: ParsedGif) {
	const gct = gif.gct; // Uint8Array | undefined
	const index = gif.lsd?.backgroundColorIndex ?? 0;

	if (!gct || !gct.length) return [0, 0, 0]; // no global table at all

	const base = index * 3;
	if (base + 2 >= gct.length) return [0, 0, 0]; // out-of-range guard

	return [gct[base], gct[base + 1], gct[base + 2]];
}

/* ---------- worker main ---------------------------------------------- */
self.onmessage = ({ data: buf }) => {
	const gif = parseGIF(buf);
	const frames = decompressFrames(gif, true); // buildRGBA = true
	const { width: W, height: H } = gif.lsd;
	const bgColor = getBgColor(gif);

	const atlas = new Uint8Array(W * H * frames.length); // 1 byte per pixel per frame
	const canvasRGBA = new Uint8ClampedArray(W * H * 4); // persistent

	frames.forEach(({ patch, dims, disposalType }, f) => {
		const { width: pw, height: ph, left: px, top: py } = dims;

		/* (a) Save snapshot if disposal 3 (restore-previous) */
		let prevPatch = null;
		if (disposalType === 3) prevPatch = canvasRGBA.slice(); // clone

		// create new frame with diff
		for (let y = 0; y < ph; y++) {
			for (let x = 0; x < pw; x++) {
				const src = (y * pw + x) * 4;
				const dst = ((py + y) * W + (px + x)) * 4;
				canvasRGBA[dst] = patch[src];
				canvasRGBA[dst + 1] = patch[src + 1];
				canvasRGBA[dst + 2] = patch[src + 2];
				canvasRGBA[dst + 3] = patch[src + 3];
			}
		}

		// copy new frame into buffer
		const sliceOffset = f * W * H;
		for (let i = 0, p = 0; i < canvasRGBA.length; i += 4, p++) {
			const L = rgbToLuma(canvasRGBA[i], canvasRGBA[i + 1], canvasRGBA[i + 2]);
			atlas[sliceOffset + p] = L;
		}
	});

	self.postMessage(
		{ buf: atlas.buffer, width: W, height: H, frames: frames.length },
		[atlas.buffer]
	);
};
