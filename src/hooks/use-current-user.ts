import { useEffect, useState } from "react";

import { apiGet } from "@/lib/api";

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: string;
  authenticated: boolean;
};

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGet<AuthUser>("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { user, isLoading };
}
