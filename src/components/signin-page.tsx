import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { signInSchema, type SignInValues } from "@/components/auth/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormActions, FormBody, FormMetaRow } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

export function SignInPage() {
	const { login, isLoading, error } = useAuth();
	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "", remember: false },
	});

	async function onSubmit(values: SignInValues) {
		await login(values);
		// TODO: on success, redirect to the account/home page.
	}

	return (
		<AuthLayout
			title="Seja bem-vindo(a) de volta!"
			lead="Acesse sua conta para acompanhar sua coleção da Copa 2026."
			footer={
				<>
					Não tem conta?{" "}
					<Button asChild variant="link" className="px-0">
						<a href="/signup">Cadastre-se</a>
					</Button>
				</>
			}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FormBody>
						{error && (
							<Alert variant="error">
								<AlertDescription>
									Não foi possível entrar. Verifique seus dados e tente
									novamente.
								</AlertDescription>
							</Alert>
						)}
						<AuthField<SignInValues>
							name="email"
							label="E-mail"
							type="email"
							placeholder="pele@brasil.com"
							autoComplete="email"
						/>
						<AuthField<SignInValues>
							name="password"
							label="Senha"
							type="password"
							placeholder="••••••••"
							autoComplete="current-password"
						/>
						<FormMetaRow>
							<Checkbox label="Lembrar-me" {...form.register("remember")} />
							{/* <Button asChild variant="link" className="px-0">
                <a href="/signin">Esqueci minha senha</a>
              </Button> */}
						</FormMetaRow>
						<FormActions>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Entrando..." : "Entrar"}
							</Button>
						</FormActions>
					</FormBody>
				</form>
			</Form>
		</AuthLayout>
	);
}
