import { motion } from "framer-motion";
import { Eye, Calendar, Clock, Download } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	delay?: number;
}

const StatCard = ({ title, value, icon, delay = 0 }: StatCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay }}
		className="p-6 rounded-xl shadow-sm border border-gray-100"
		style={{
			backgroundColor: "var(--background-card)",
			borderColor: "var(--border-primary)",
		}}
	>
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}	>
					{title}
				</p>
				<p className="text-2xl font-semibold text-gray-900 mt-1" style={{ color: "var(--text-primary)" }}>
					{value}
				</p>
			</div>
			<div className="p-3 rounded-lg" style={{ color: "var(--text-primary)" }}>
				{icon}
			</div>
		</div>
	</motion.div>
);

export const FileStats = () => {
	// TODO: Replace with actual data from API
	const stats = [
		{
			title: "Today Views",
			value: "2,845",
			icon: <Eye className="w-6 h-6 text-primary" />,
		},
		{
			title: "Weekly Views",
			value: "12,458",
			icon: <Calendar className="w-6 h-6 text-primary" />,
		},
		{
			title: "Monthly Views",
			value: "48,592",
			icon: <Clock className="w-6 h-6 text-primary" />,
		},
		{
			title: "Total Downloads",
			value: "124,895",
			icon: <Download className="w-6 h-6 text-primary" />,
		},
	];

	return (
		<div className="w-full max-w-7xl mx-auto p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.title} {...stat} delay={index * 0.1} />
				))}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mt-8 rounded-xl shadow-sm border border-gray-100 p-6"
				style={{
					backgroundColor: "var(--background-card)",
					borderColor: "var(--border-primary)",
				}}
			>
				<h3 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
					Recent Activity
				</h3>
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="flex items-center justify-between py-3 border-b last:border-0"
							style={{
								borderColor: "var(--border-primary)",
							}}
						>
							<div>
								<p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
									File_{i + 1}.pdf
								</p>
								<p className="text-xs" style={{ color: "var(--text-secondary)" }}>
									Viewed 2 minutes ago
								</p>
							</div>
							<span className="text-xs font-medium text-primary">
								{Math.floor(Math.random() * 100)} views
							</span>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
};
