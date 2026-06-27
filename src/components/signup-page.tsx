import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/auth-field";
import { AuthLayout } from "@/components/auth/auth-layout";
import { signUpSchema, type SignUpValues } from "@/components/auth/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormActions, FormBody } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { maskCpf } from "@/lib/masks";

export function SignUpPage() {
	const { signup, isLoading, error } = useAuth();
	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			lastName: "",
			birthDate: "",
			cpf: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: SignUpValues) {
		await signup(values);
	}

	return (
		<AuthLayout
			title="Junte-se ao time!"
			lead="Crie sua conta e comece sua coleção da Copa do Mundo 2026."
			wide
			footer={
				<>
					Já tem conta?{" "}
					<Button asChild variant="link" className="px-0">
						<a href="/signin">Entrar</a>
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
									Não foi possível criar a conta. Tente novamente.
								</AlertDescription>
							</Alert>
						)}
						<div className="grid grid-cols-2 divide-x divide-slate-100">
							{/* Coluna 1 — Informações pessoais */}
							<div className="space-y-5 pr-8">
								<p className="font-sans text-[11px] font-semibold uppercase text-slate-400">
									Informações pessoais
								</p>
								<div className="grid grid-cols-2 gap-4">
									<AuthField<SignUpValues>
										name="name"
										label="Nome"
										type="text"
										placeholder="Seu nome"
										autoComplete="given-name"
									/>
									<AuthField<SignUpValues>
										name="lastName"
										label="Sobrenome"
										type="text"
										placeholder="Seu sobrenome"
										autoComplete="family-name"
									/>
								</div>
								<AuthField<SignUpValues>
									name="birthDate"
									label="Data de nascimento"
									type="date"
									autoComplete="bday"
								/>
								<AuthField<SignUpValues>
									name="cpf"
									label="CPF"
									type="text"
									placeholder="000.000.000-00"
									autoComplete="off"
									mask={maskCpf}
								/>
							</div>

							{/* Coluna 2 — Dados de acesso */}
							<div className="space-y-5 pl-8">
								<p className="font-sans text-[11px] font-semibold uppercase text-slate-400">
									Dados de acesso
								</p>
								<AuthField<SignUpValues>
									name="email"
									label="E-mail"
									type="email"
									placeholder="pele@brasil.com"
									autoComplete="email"
								/>
								<AuthField<SignUpValues>
									name="password"
									label="Senha"
									type="password"
									placeholder="••••••••"
									autoComplete="new-password"
								/>
								<AuthField<SignUpValues>
									name="confirmPassword"
									label="Confirmar senha"
									type="password"
									placeholder="••••••••"
									autoComplete="new-password"
								/>
							</div>
						</div>
						<FormActions>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Criando conta..." : "Criar conta"}
							</Button>
						</FormActions>
					</FormBody>
				</form>
			</Form>
		</AuthLayout>
	);
}
