import { motion } from "framer-motion";
import {
	Users,
	Clock,
	TrendingUp,
	Globe,
	Smartphone,
	Share2,
	BarChart,
	Activity,
} from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	delay?: number;
}

const StatCard = ({
	title,
	value,
	subtitle,
	icon,
	delay = 0,
}: StatCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay }}
		className="p-3 rounded-xl shadow-sm"
		style={{
			backgroundColor: "var(--background-card)",
			borderColor: "var(--border-primary)",
			border: "1px solid var(--border-primary)",
		}}
	>
		<div className="flex items-center gap-2">
			<div
				className="p-2 rounded-lg shrink-0"
				style={{ backgroundColor: "var(--background-tertiary)" }}
			>
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<p
					className="text-lg font-bold truncate"
					style={{ color: "var(--text-primary)" }}
				>
					{value}
				</p>
				<p
					className="text-xs font-medium truncate"
					style={{ color: "var(--text-secondary)" }}
				>
					{title}
				</p>
				{subtitle && (
					<p
						className="text-xs mt-0.5 truncate"
						style={{ color: "var(--text-tertiary)" }}
					>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	</motion.div>
);

const TrendChart = () => (
	<div className="flex items-end justify-between h-32 px-2 mt-4 gap-1">
		{[40, 65, 45, 75, 55, 85, 70].map((height, i) => (
			<motion.div
				key={i}
				initial={{ height: 0 }}
				animate={{ height: `${height}%` }}
				transition={{ delay: i * 0.1, duration: 0.5 }}
				className="w-full rounded-t-lg"
				style={{ backgroundColor: "var(--accent-primary)" }}
			/>
		))}
	</div>
);

export const FileStats = () => {
	// In a real app, these would come from your analytics service
	const stats = [
		{
			title: "Active Users",
			value: "2,845",
			subtitle: "↑ 12% from last week",
			icon: (
				<Users className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
			),
		},
		{
			title: "Avg. Session Duration",
			value: "4:32",
			subtitle: "Users spend more time sharing files",
			icon: (
				<Clock className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
			),
		},
		{
			title: "Conversion Rate",
			value: "8.7%",
			subtitle: "Of visitors complete file sharing",
			icon: (
				<TrendingUp
					className="w-5 h-5"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
		},
		{
			title: "Global Reach",
			value: "42",
			subtitle: "Countries with active users",
			icon: (
				<Globe className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
			),
		},
	];

	const engagementStats = [
		{
			title: "Device Distribution",
			value: "68% Mobile",
			subtitle: "Growing mobile user base",
			icon: (
				<Smartphone
					className="w-5 h-5"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
		},
		{
			title: "Sharing Rate",
			value: "3.2",
			subtitle: "Avg. shares per upload",
			icon: (
				<Share2
					className="w-5 h-5"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
		},
		{
			title: "Peak Hours",
			value: "2-5 PM",
			subtitle: "Highest activity period",
			icon: (
				<Activity
					className="w-5 h-5"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
		},
		{
			title: "User Growth",
			value: "+24%",
			subtitle: "Month over month",
			icon: (
				<BarChart
					className="w-5 h-5"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
		},
	];

	return (
		<div className="w-full max-w-7xl mx-auto py-4 p-6 md:p-6">
			<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
				{stats.map((stat, index) => (
					<StatCard key={stat.title} {...stat} delay={index * 0.1} />
				))}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mt-4 md:mt-8 rounded-xl shadow-sm p-3 md:p-6"
				style={{
					backgroundColor: "var(--background-card)",
					borderColor: "var(--border-primary)",
					border: "1px solid var(--border-primary)",
				}}
			>
				<div className="flex items-center justify-between mb-3 md:mb-6">
					<h3
						className="text-base md:text-lg font-semibold"
						style={{ color: "var(--text-primary)" }}
					>
						Weekly Engagement Trend
					</h3>
					<select
						className="px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm"
						style={{
							backgroundColor: "var(--background-tertiary)",
							color: "var(--text-secondary)",
							border: "1px solid var(--border-primary)",
						}}
					>
						<option>Last 7 days</option>
						<option>Last 30 days</option>
						<option>Last 90 days</option>
					</select>
				</div>
				<TrendChart />
			</motion.div>

			<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mt-4 md:mt-8">
				{engagementStats.map((stat, index) => (
					<StatCard key={stat.title} {...stat} delay={index * 0.1 + 0.6} />
				))}
			</div>
		</div>
	);
};
