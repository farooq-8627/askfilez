import { motion } from "framer-motion";
import { FileUp, Shield, Clock, Users, Share2, Code } from "lucide-react";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
	<motion.div
		whileHover={{ scale: 1.02 }}
		className="p-4 sm:p-6 rounded-xl"
		style={{
			backgroundColor: "var(--background-card)",
			border: "1px solid var(--border-primary)",
		}}
	>
		<div className="flex items-start gap-3 sm:gap-4">
			<div
				className="p-2 sm:p-3 rounded-lg"
				style={{ backgroundColor: "var(--background-tertiary)" }}
			>
				{icon}
			</div>
			<div>
				<h3
					className="text-base sm:text-lg font-semibold mb-1 sm:mb-2"
					style={{ color: "var(--text-primary)" }}
				>
					{title}
				</h3>
				<p
					className="text-sm leading-relaxed"
					style={{ color: "var(--text-secondary)" }}
				>
					{description}
				</p>
			</div>
		</div>
	</motion.div>
);

export const About = () => {
	const features = [
		{
			icon: (
				<FileUp
					className="w-6 h-6"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
			title: "Easy File Sharing",
			description:
				"Upload and share files instantly with a unique code. Support for all file types and sizes.",
		},
		{
			icon: (
				<Shield
					className="w-6 h-6"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
			title: "Secure & Private",
			description:
				"Your files are encrypted and automatically deleted after 21 days for enhanced privacy.",
		},
		{
			icon: (
				<Clock className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
			),
			title: "Time-Limited Storage",
			description:
				"Files are stored for 21 days, ensuring your shared content remains private and storage stays clean.",
		},
		{
			icon: (
				<Users className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
			),
			title: "User Tracking",
			description:
				"Keep track of who uploads and shares files with built-in username support.",
		},
		{
			icon: (
				<Share2
					className="w-6 h-6"
					style={{ color: "var(--accent-primary)" }}
				/>
			),
			title: "Simple Sharing",
			description:
				"Share files using simple codes - no accounts or complex links needed.",
		},
		{
			icon: (
				<Code className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
			),
			title: "File Preview",
			description:
				"Preview supported files directly in the browser before downloading.",
		},
	];

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-8 sm:mb-16"
			>
				<h1
					className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6"
					style={{ color: "var(--text-primary)" }}
				>
					About AskFilez
				</h1>
				<p
					className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
					style={{ color: "var(--text-secondary)" }}
				>
					AskFilez is a modern file sharing platform designed for simplicity and
					security. Share files instantly with unique codes, no registration
					required.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-16"
			>
				{features.map((feature, index) => (
					<motion.div
						key={feature.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 * (index + 1) }}
					>
						<FeatureCard {...feature} />
					</motion.div>
				))}
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="rounded-xl p-4 sm:p-8 text-center"
				style={{
					backgroundColor: "var(--background-card)",
					border: "1px solid var(--border-primary)",
				}}
			>
				<h2
					className="text-xl sm:text-2xl font-semibold mb-4"
					style={{ color: "var(--text-primary)" }}
				>
					How It Works
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					<div>
						<div
							className="text-2xl sm:text-3xl font-bold mb-2"
							style={{ color: "var(--accent-primary)" }}
						>
							1
						</div>
						<h3
							className="text-base sm:text-lg font-medium mb-1 sm:mb-2"
							style={{ color: "var(--text-primary)" }}
						>
							Upload Files
						</h3>
						<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
							Drag & drop your files or click to select them
						</p>
					</div>
					<div>
						<div
							className="text-2xl sm:text-3xl font-bold mb-2"
							style={{ color: "var(--accent-primary)" }}
						>
							2
						</div>
						<h3
							className="text-base sm:text-lg font-medium mb-1 sm:mb-2"
							style={{ color: "var(--text-primary)" }}
						>
							Get Code
						</h3>
						<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
							Receive a unique code for your uploaded files
						</p>
					</div>
					<div>
						<div
							className="text-2xl sm:text-3xl font-bold mb-2"
							style={{ color: "var(--accent-primary)" }}
						>
							3
						</div>
						<h3
							className="text-base sm:text-lg font-medium mb-1 sm:mb-2"
							style={{ color: "var(--text-primary)" }}
						>
							Share
						</h3>
						<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
							Share the code with others to access files
						</p>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="mt-8 sm:mt-16 text-center"
			>
				<h2
					className="text-xl sm:text-2xl font-semibold mb-4"
					style={{ color: "var(--text-primary)" }}
				>
					Ready to Share Files?
				</h2>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => (window.location.href = "/")}
					className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2"
					style={{
						backgroundColor: "var(--accent-primary)",
						color: "var(--text-inverted)",
					}}
				>
					<FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
					Start Uploading
				</motion.button>
			</motion.div>
		</div>
	);
};
