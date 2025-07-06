import { POSTS_DIR } from "@/lib/common";
import fs from "node:fs/promises";

export async function generateStaticParams() {
	const files = await fs.readdir(POSTS_DIR);
	return files.map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	return { title: slug };
}

export default async function BlogPost({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const { default: Project } = await import(`@/projects/${slug}.md`);

	return (
		<div className="prose mx-auto lg:prose-xl p-5 bg-white text-black">
			<Project />
		</div>
	);
}
