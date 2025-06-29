import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
	title: "My website",
	description: "Personal website for Pradyun Kamaraju",
};

const tnr = localFont({
	src: "./times.ttf",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased ${tnr.className}`}>{children}</body>
		</html>
	);
}
