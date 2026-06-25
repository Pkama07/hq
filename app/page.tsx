import Image from "next/image";
import AsciiPlayer from "@/app/components/AsciiPlayer";

export default async function Home() {
	return (
		<div className="h-fit min-h-screen min-w-fit w-screen bg-white text-black p-5">
			<p>Member of Technical Staff at SafetyKit in San Francisco</p>
			<p>Previous experience:</p>
			<ul className="list-disc pl-8">
				<li>Summer 2025: SWE Intern at Palantir in NYC</li>
				<li>Summer 2024: SWE Intern at Molex in Bridgewater, NJ</li>
				<li>Summer 2023: SWE Intern at Zurich Insurance in Barcelona, Spain</li>
			</ul>
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
