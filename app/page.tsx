import Image from "next/image";
import ProjectLink from "./components/ProjectLink";

export default function Home() {
	return (
		<div className="h-screen w-screen bg-white text-black p-5">
			<p>
				Hi, I'm Pradyun. I study computer science and math at Purdue. I
				currently work at Palantir in NYC and I'm planning on working at a
				startup in SF this fall.
			</p>
			<div className="mt-5">
				Here's a list of the projects I've built:
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
				src="https://gifdb.com/images/high/dance-walk-jimbo-boss-baby-i90nn238y9ezarqv.webp"
				alt="dancing jimbo"
				width={300}
				height={300}
				className="mt-5"
			/>
		</div>
	);
}
