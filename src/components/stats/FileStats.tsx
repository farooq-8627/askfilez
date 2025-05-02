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
		className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
	>
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-600">{title}</p>
				<p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
			</div>
			<div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
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
				className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
			>
				<h3 className="text-lg font-semibold text-gray-900 mb-6">
					Recent Activity
				</h3>
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
						>
							<div>
								<p className="text-sm font-medium text-gray-900">
									File_{i + 1}.pdf
								</p>
								<p className="text-xs text-gray-500">Viewed 2 minutes ago</p>
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
