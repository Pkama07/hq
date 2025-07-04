import Image from "next/image";
import ProjectLink from "@/app/components/ProjectLink";
import AsciiPlayer from "@/app/components/AsciiPlayer";

export default function Home() {
	return (
		<div className="h-fit min-h-screen w-screen bg-white text-black p-5">
			<p>
				Hi, I&apos;m Pradyun. I study computer science and math at Purdue. I
				currently work at Palantir in NYC and I&apos;m planning on working at a
				startup in SF this fall.
			</p>
			<div className="mt-5">
				Here&apos;s a list of the projects I&apos;ve built:
				<ul className="list-disc list-inside">
					<li>
						<ProjectLink
							title="my personal website (this one)"
							projectUrl="https://pradyun.dev"
							githubUrl="https://github.com/Pkama07/hq"
						/>
					</li>
				</ul>
			</div>
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
