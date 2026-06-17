import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
	label: string;
	content: React.ReactNode;
	icon?: React.ReactNode;
}

interface TabsProps {
	tabs: Tab[];
	defaultTab?: number;
}

function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
	const tabsId = React.useId();
	const [activeTab, setActiveTab] = React.useState(() => defaultTab);
	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
			return;
		}

		event.preventDefault();
		setActiveTab((current) => {
			if (event.key === "ArrowRight") {
				return (current + 1) % tabs.length;
			}

			return (current - 1 + tabs.length) % tabs.length;
		});
	};

	return (
		<div className="w-full">
			<div role="tablist" className="flex border-b border-slate-200">
				{tabs.map((tab, index) => (
					<button
						key={tab.label}
						type="button"
						role="tab"
						id={`${tabsId}-tab-${index}`}
						aria-controls={`${tabsId}-panel-${index}`}
						aria-selected={activeTab === index}
						tabIndex={activeTab === index ? 0 : -1}
						onClick={() => setActiveTab(index)}
						onKeyDown={handleKeyDown}
						className={cn(
							"flex items-center gap-2 px-4 py-3 text-[14px] leading-5 font-['Poppins',sans-serif] font-medium",
							"transition-[color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
							activeTab === index
								? "border-b-2 border-blue-700 text-blue-700"
								: "text-slate-400 hover:text-slate-900",
						)}
					>
						{tab.icon && <span>{tab.icon}</span>}
						{tab.label}
					</button>
				))}
			</div>
			<div
				role="tabpanel"
				id={`${tabsId}-panel-${activeTab}`}
				aria-labelledby={`${tabsId}-tab-${activeTab}`}
				className="py-4"
			>
				{tabs[activeTab]?.content}
			</div>
		</div>
	);
}

export { Tabs };
