import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/auth-field";
import {
	signInSchema,
	signUpSchema,
	type SignInValues,
	type SignUpValues,
} from "@/components/auth/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormActions, FormBody } from "@/components/ui/form";
import { apiPost } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { maskCpf } from "@/lib/masks";
import { H2, P } from "../typography";

type Mode = "signup" | "login";

interface ModeFooterProps {
	mode: Mode;
	onSwitch: (mode: Mode) => void;
}

function ModeFooter({ mode, onSwitch }: ModeFooterProps) {
	return (
		<p className="-mt-3 text-center font-sans text-sm text-slate-500">
			{mode === "signup" ? (
				<>
					Já tem conta?{" "}
					<button
						type="button"
						onClick={() => onSwitch("login")}
						className="font-medium text-blue-700 hover:underline"
					>
						Entrar
					</button>
				</>
			) : (
				<>
					Não tem conta?{" "}
					<button
						type="button"
						onClick={() => onSwitch("signup")}
						className="font-medium text-blue-700 hover:underline"
					>
						Cadastre-se
					</button>
				</>
			)}
		</p>
	);
}

interface SignupFormProps {
	onSuccess: () => void;
	onSwitchMode: (mode: Mode) => void;
}

function SignupForm({ onSuccess, onSwitchMode }: SignupFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { mergeGuestCartOnLogin } = useCart();

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
		setIsLoading(true);
		setError(null);
		try {
			await apiPost("/auth/register/client", {
				name: `${values.name} ${values.lastName}`,
				email: values.email,
				password: values.password,
				cpf: values.cpf.replace(/\D/g, ""),
				dateOfBirth: values.birthDate,
			});
			await apiPost("/auth/login", {
				email: values.email,
				password: values.password,
			});
			await mergeGuestCartOnLogin();
			onSuccess();
		} catch {
			setError(
				"Não foi possível criar a conta. Verifique os dados e tente novamente.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<FormBody>
					{error && (
						<Alert variant="error">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<H2 className="text-xl font-semibold text-slate-800 text-center mb-3">
						Cadastre-se
					</H2>
					<P className="text-center text-slate-600">
						Crie uma conta para finalizar seu pedido e acompanhar suas compras.
					</P>
					<div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-0 md:divide-x md:divide-slate-100">
						<div className="space-y-5 md:pr-8">
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

						<div className="space-y-5 md:pl-8">
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
						<Button
							type="submit"
							size="lg"
							className="w-full max-w-md mx-auto cursor-pointer"
							disabled={isLoading}
						>
							{isLoading ? "Criando conta..." : "Continuar"}
						</Button>
					</FormActions>

					<ModeFooter mode="signup" onSwitch={onSwitchMode} />
				</FormBody>
			</form>
		</Form>
	);
}

interface LoginFormProps {
	onSuccess: () => void;
	onSwitchMode: (mode: Mode) => void;
}

function LoginForm({ onSuccess, onSwitchMode }: LoginFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { mergeGuestCartOnLogin } = useCart();

	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "", remember: false },
	});

	async function onSubmit(values: SignInValues) {
		setIsLoading(true);
		setError(null);
		try {
			await apiPost("/auth/login", {
				email: values.email,
				password: values.password,
			});
			await mergeGuestCartOnLogin();
			onSuccess();
		} catch {
			setError(
				"Não foi possível entrar. Verifique seus dados e tente novamente.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<div className="mb-7">
				<H2 className="text-xl font-semibold text-slate-800 text-center mb-3">
					Entre em sua conta
				</H2>
				<P className="text-center text-slate-600">
					Faça login para finalizar seu pedido.
				</P>
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				noValidate
				className="max-w-xl mx-auto"
			>
				<FormBody>
					{error && (
						<Alert variant="error">
							<AlertDescription>{error}</AlertDescription>
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

					<FormActions>
						<Button
							type="submit"
							size="lg"
							className="w-full max-w-md mx-auto cursor-pointer"
							disabled={isLoading}
						>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</FormActions>

					<ModeFooter mode="login" onSwitch={onSwitchMode} />
				</FormBody>
			</form>
		</Form>
	);
}

interface CartIdentificationFormProps {
	onSuccess: () => void;
}

export function CartIdentificationForm({
	onSuccess,
}: CartIdentificationFormProps) {
	const [mode, setMode] = useState<Mode>("signup");

	return mode === "signup" ? (
		<SignupForm onSuccess={onSuccess} onSwitchMode={setMode} />
	) : (
		<LoginForm onSuccess={onSuccess} onSwitchMode={setMode} />
	);
}
