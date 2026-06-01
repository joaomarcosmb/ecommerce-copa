import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";

export type ClientProfile = {
  userId: string;
  name: string;
  email: string;
  cpf: string;
  dateOfBirth: string;
};

export function useClientProfile() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    apiGet<ClientProfile>("/clients/me")
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err : new Error("Erro inesperado"))
      )
      .finally(() => setIsLoading(false));
  }, []);

  return { profile, isLoading, error };
}
