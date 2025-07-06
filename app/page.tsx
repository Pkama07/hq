import Image from "next/image";
import AsciiPlayer from "@/app/components/AsciiPlayer";
import { POSTS_DIR } from "@/lib/common";
import fs from "node:fs/promises";
import ProjectLink from "./components/ProjectLink";

async function getGithubUrl(filename: string): Promise<string | undefined> {
	const content = await fs.readFile(`${POSTS_DIR}/${filename}`, "utf-8");
	const match = content.match(/\[github_url\]:\s*<>\s*\((.*?)\)/);
	return match?.[1];
}

export default async function Home() {
	const files = await fs.readdir(POSTS_DIR);
	const projects = await Promise.all(
		files.map(async (f) => ({
			slug: f.replace(/\.md$/, "").replace(/\.mdx$/, ""),
			githubUrl: await getGithubUrl(f),
		}))
	);

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
						<ProjectLink
							title={p.slug}
							projectUrl={`/projects/${p.slug}`}
							githubUrl={p.githubUrl}
						/>
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
