import { FaGithub } from "react-icons/fa";

interface ProjectLinkProps {
	projectUrl: string;
	githubUrl?: string;
	title: string;
}

export default function ProjectLink({
	projectUrl,
	githubUrl,
	title,
}: ProjectLinkProps) {
	return (
		<div className="inline-flex items-center gap-2">
			<a
				href={projectUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 hover:text-blue-800 underline"
			>
				{title}
			</a>
			{githubUrl && (
				<a
					href={githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-gray-600 hover:text-gray-800"
					title="View on GitHub"
				>
					<FaGithub />
				</a>
			)}
		</div>
	);
}
