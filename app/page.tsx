import Image from "next/image";
import AsciiPlayer from "@/app/components/AsciiPlayer";

export default async function Home() {
	return (
		<div className="h-fit min-h-screen min-w-fit w-screen bg-white text-black p-5">
			<div className="mb-5">
				<p className="text-2xl font-bold">Pradyun Kamaraju</p>
				<p>pradyunkamaraju [at] gmail.com</p>
			</div>
			<p>
				I'm a Member of Technical Staff at SafetyKit in San Francisco. Prior to
				this, I was a SWE intern at Palantir in NYC on the Data Connection team.
			</p>
			<p>
				I graduated from Purdue University with degrees in Computer Science and
				Math in May 2026.
			</p>
			<Image
				src="/jimbo.gif"
				alt="dancing jimbo"
				width={220}
				height={164}
				className="my-5"
			/>
			<AsciiPlayer />
		</div>
	);
}
