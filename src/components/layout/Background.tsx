import React from "react";
import { useTheme } from "../../theme/ThemeContext";

export const Background: React.FC = () => {
	const { mode } = useTheme();
	const isDark = mode === "dark";

	return (
		<div
			className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-300 ${
				isDark ? "bg-[#0A2540]" : "bg-gradient-to-b from-white to-[#E3F5FF]"
			}`}
		>
			{/* Main light effect */}
			<div
				className="absolute top-1/2 left-1/2"
				style={{
					width: "200vw",
					height: "200vh",
					background: isDark
						? "radial-gradient(circle at center, rgba(30, 80, 120, 0.7) 0%, rgba(13, 46, 77, 0.2) 35%, transparent 70%)"
						: "radial-gradient(circle at center, rgba(145, 227, 255, 0.8) 0%, rgba(145, 227, 255, 0.3) 35%, transparent 70%)",
					filter: "blur(60px)",
					transform: "translate(-50%, -50%)",
				}}
			/>

			{/* Secondary glow */}
			<div
				className="absolute top-1/2 left-1/2"
				style={{
					width: "180vw",
					height: "180vh",
					background: isDark
						? "radial-gradient(circle at center, rgba(25, 70, 110, 0.5) 0%, rgba(13, 46, 77, 0.2) 40%, transparent 75%)"
						: "radial-gradient(circle at center, rgba(179, 236, 255, 0.6) 0%, rgba(145, 227, 255, 0.2) 40%, transparent 75%)",
					filter: "blur(80px)",
					transform: "translate(-50%, -50%) rotate(15deg)",
				}}
			/>

			{/* Intense center glow */}
			<div
				className="absolute top-1/2 left-1/2"
				style={{
					width: "100vw",
					height: "100vh",
					background: isDark
						? "radial-gradient(circle at center, rgba(35, 90, 130, 0.8) 0%, transparent 50%)"
						: "radial-gradient(circle at center, rgba(179, 236, 255, 0.9) 0%, transparent 50%)",
					filter: "blur(40px)",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</div>
	);
};
