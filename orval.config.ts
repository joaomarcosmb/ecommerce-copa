import { defineConfig } from "orval";

export default defineConfig({
	api: {
		output: {
			mode: "single",
			target: "src/api/generated/endpoints.ts",
			schemas: "src/api/generated/model",
			baseUrl: "http://localhost:8080",
			client: "fetch",
			formatter: "biome",
		},
		input: {
			target: "http://localhost:8080/api-docs",
		},
	},
});
