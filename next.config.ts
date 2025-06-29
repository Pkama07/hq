import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL(
				"https://gifdb.com/images/high/dance-walk-jimbo-boss-baby-i90nn238y9ezarqv.webp"
			),
		],
	},
};

export default nextConfig;
