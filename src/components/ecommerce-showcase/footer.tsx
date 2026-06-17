import { Mail, MapPin, Phone } from "lucide-react";

import { categories } from "./data";

const contactItems = [
	{ icon: Mail, label: "contato@cupstickers.com.br" },
	{ icon: Phone, label: "(85) 3333-4444" },
	{ icon: MapPin, label: "Fortaleza, CE – Brasil" },
];

const socialIcons = [
	{ src: "/instagram.svg", label: "Instagram" },
	{ src: "/x.svg", label: "Twitter" },
	{ src: "/facebook.svg", label: "Facebook" },
];

export function Footer() {
	return (
		<footer className="bg-slate-950 text-white mt-30">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
					{/* Brand */}
					<div className="flex flex-col gap-5">
						<span className="font-big-shoulders text-4xl font-black tracking-tight">
							CupStickers
						</span>
						<p className="text-sm leading-relaxed text-slate-400">
							A loja oficial de figurinhas, álbuns e colecionáveis da Copa do
							Mundo 2026™. Conectando colecionadores em todo o Brasil.
						</p>
						<div className="flex gap-3">
							{socialIcons.map(({ src, label }) => (
								<button
									key={label}
									aria-label={label}
									className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-slate-700"
								>
									<img
										src={src}
										alt=""
										aria-hidden="true"
										className="size-5 invert"
									/>
								</button>
							))}
						</div>
					</div>

					{/* Categorias */}
					<div>
						<h3 className="mb-5 text-sm font-semibold text-white">
							Categorias
						</h3>
						<ul className="flex flex-col gap-3">
							{categories.map(({ label }) => (
								<li key={label}>
									<a
										href="#"
										className="text-sm text-slate-400 transition-colors hover:text-white"
									>
										{label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contato */}
					<div>
						<h3 className="mb-5 text-sm font-semibold text-white">Contato</h3>
						<ul className="flex flex-col gap-3">
							{contactItems.map(({ icon: Icon, label }) => (
								<li key={label} className="flex items-center gap-3">
									<Icon
										className="size-4 shrink-0 text-slate-500"
										aria-hidden="true"
									/>
									<span className="text-sm text-slate-400">{label}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<p className="mt-16 text-xs text-slate-500 border-t border-slate-800 pt-8">
					© 2026 CupStickers. Todos os direitos reservados. Produtos licenciados
					FIFA™.
				</p>
			</div>
		</footer>
	);
}
