// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		server: {
			proxy: {
				"/api": {
					target: "https://ecommerce-copa-api.onrender.com",
					changeOrigin: true,
				},
			},
		},
	},
	integrations: [react()],
});
