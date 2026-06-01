import { useState } from "react";

import type { SignInValues, SignUpValues } from "@/components/auth/schemas";

type AuthState = {
  isLoading: boolean;
  error: Error | null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    // TODO: replace with fetch("/api/auth/login", { method: "POST", body: JSON.stringify(values) })
    await run(async () => {
      await delay(600);
      void values;
    });
  }

  async function signup(values: SignUpValues) {
    // TODO: replace with fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(values) })
    await run(async () => {
      await delay(600);
      void values;
    });
  }

  return { login, signup, isLoading: state.isLoading, error: state.error };
}
