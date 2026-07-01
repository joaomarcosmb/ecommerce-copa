import { defineConfig } from "orval";

export default defineConfig({
	api: {
		output: {
			mode: "single",
			target: "src/api/generated/endpoints.ts",
			schemas: "src/api/generated/model",
			baseUrl: "https://ecommerce-copa-api.onrender.com",
			client: "fetch",
			formatter: "biome",
		},
		input: {
			target: "https://ecommerce-copa-api.onrender.com/api-docs",
		},
	},
});
