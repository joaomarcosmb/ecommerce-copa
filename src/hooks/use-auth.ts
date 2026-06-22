import { useState } from "react";

import type { SignInValues, SignUpValues } from "@/components/auth/schemas";
import { apiPost } from "@/lib/api";

type AuthState = {
	isLoading: boolean;
	error: Error | null;
};

export function useAuth() {
	const [state, setState] = useState<AuthState>({
		isLoading: false,
		error: null,
	});

	async function run(action: () => Promise<void>) {
		setState({ isLoading: true, error: null });
		try {
			await action();
			setState({ isLoading: false, error: null });
		} catch (error) {
			setState({
				isLoading: false,
				error: error instanceof Error ? error : new Error("Erro inesperado"),
			});
		}
	}

	async function login(values: SignInValues) {
		await run(async () => {
			const user = await apiPost<{ role?: string }>("/auth/login", {
				email: values.email,
				password: values.password,
			});
			window.location.href = user?.role === "ADMIN" ? "/admin" : "/";
		});
	}

	async function signup(values: SignUpValues) {
		await run(async () => {
			await apiPost("/auth/register/client", {
				name: `${values.name} ${values.lastName}`,
				email: values.email,
				password: values.password,
				cpf: values.cpf.replace(/\D/g, ""),
				dateOfBirth: values.birthDate,
			});
			window.location.href = "/signin";
		});
	}

	async function logout() {
		await run(async () => {
			await apiPost("/auth/logout");
			window.location.href = "/";
		});
	}

	return {
		login,
		signup,
		logout,
		isLoading: state.isLoading,
		error: state.error,
	};
}
