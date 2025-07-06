import Image from "next/image";
import AsciiPlayer from "@/app/components/AsciiPlayer";
import { POSTS_DIR } from "@/lib/common";
import fs from "node:fs/promises";
import ProjectLink from "./components/ProjectLink";

export default async function Home() {
	// go through all of the files in POSTS_DIR and, for each file in there, give it an entry in the list of projects as a link to /projects/[slug]
	const files = await fs.readdir(POSTS_DIR);
	const projects = files.map((f) => ({
		slug: f.replace(/\.md$/, "").replace(/\.mdx$/, ""),
	}));

	return (
		<div className="h-fit min-h-screen min-w-fit w-screen bg-white text-black p-5">
			<p>
				Hi, I&apos;m Pradyun. I study computer science and math at Purdue. I
				currently work at Palantir in NYC and I&apos;m planning on working at a
				startup in SF this fall.
			</p>
			<div className="mt-5">
				I like keeping notes of my thoughts as I work through projects. Here are
				some of them:
			</div>
			<ul className="list-disc pl-8">
				{projects.map((p) => (
					<li key={p.slug}>
						<ProjectLink title={p.slug} projectUrl={`/projects/${p.slug}`} />
					</li>
				))}
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
