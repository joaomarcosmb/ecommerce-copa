import { defineConfig } from "orval";

const apiUrl =
	process.env.PUBLIC_API_URL ?? "https://ecommerce-copa-api.onrender.com";

export default defineConfig({
	api: {
		output: {
			mode: "single",
			target: "src/api/generated/endpoints.ts",
			schemas: "src/api/generated/model",
			baseUrl: apiUrl,
			client: "fetch",
			formatter: "biome",
		},
		input: {
			target: `${apiUrl}/api-docs`,
		},
	},
});
