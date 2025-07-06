import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		ul: (props) => (
			<ul
				{...props}
				className={`list-disc pl-8 mb-2 ${props.className || ""}`}
			/>
		),
		p: (props) => <p {...props} className={`mb-2 ${props.className || ""}`} />,
		ol: (props) => (
			<ol
				{...props}
				className={`list-decimal pl-8 mb-2 ${props.className || ""}`}
			/>
		),
		h1: (props) => (
			<h1
				{...props}
				className={`text-4xl font-bold mb-4 ${props.className || ""}`}
			/>
		),
		h2: (props) => (
			<h2
				{...props}
				className={`text-3xl font-bold mb-3 ${props.className || ""}`}
			/>
		),
		h3: (props) => (
			<h3
				{...props}
				className={`text-2xl font-bold mb-3 ${props.className || ""}`}
			/>
		),
		h4: (props) => (
			<h4
				{...props}
				className={`text-xl font-bold mb-2 ${props.className || ""}`}
			/>
		),
		h5: (props) => (
			<h5
				{...props}
				className={`text-lg font-bold mb-2 ${props.className || ""}`}
			/>
		),
		h6: (props) => (
			<h6
				{...props}
				className={`text-base font-bold mb-2 ${props.className || ""}`}
			/>
		),
	};
}
