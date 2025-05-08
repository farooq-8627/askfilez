import { Link } from "react-router-dom";
import {
	Search,
	Info,
	Sun,
	Moon,
	ChartBar,
	Menu,
	X,
	Upload,
} from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
	const { mode, toggleTheme } = useTheme();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const menuItems = [
		{
			to: "/",
			label: "Upload",
			icon: <Upload className="w-4 h-4" />,
		},
		{
			to: "/analytics",
			label: "Analytics",
			icon: <ChartBar className="w-4 h-4" />,
		},
		{
			to: "/search",
			label: "Search",
			icon: <Search className="w-4 h-4" />,
		},
		{
			to: "/about",
			label: "About",
			icon: <Info className="w-4 h-4" />,
		},
	];

	return (
		<header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
			<div
				className="border-b"
				style={{
					backgroundColor: "var(--background-primary)",
					borderColor: "var(--border-primary)",
				}}
			>
				<div className="container mx-auto px-3">
					<div className="flex items-center justify-between h-14">
						<Link
							to="/"
							className="text-xl font-bold transition-colors"
							style={{
								color: "var(--text-primary)",
							}}
						>
							AskFilez
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center space-x-1">
							{menuItems.map((item) => (
								<Link
									key={item.to}
									to={item.to}
									className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5"
									style={{
										color: "var(--text-secondary)",
									}}
								>
									{item.icon && <span className="mr-1.5">{item.icon}</span>}
									{item.label}
								</Link>
							))}
							<button
								onClick={toggleTheme}
								className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5"
								style={{
									color: "var(--text-secondary)",
								}}
								aria-label="Toggle theme"
							>
								{mode === "light" ? (
									<Moon className="w-4 h-4" />
								) : (
									<Sun className="w-4 h-4" />
								)}
							</button>
						</nav>

						{/* Mobile Menu Button */}
						<div className="flex items-center md:hidden">
							<button
								onClick={toggleTheme}
								className="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-1"
								style={{
									color: "var(--text-secondary)",
								}}
								aria-label="Toggle theme"
							>
								{mode === "light" ? (
									<Moon className="w-4 h-4" />
								) : (
									<Sun className="w-4 h-4" />
								)}
							</button>
							<button
								onClick={toggleMenu}
								className="inline-flex items-center justify-center p-1.5 rounded-lg"
								style={{
									color: "var(--text-secondary)",
								}}
								aria-label="Menu"
							>
								{isMenuOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="md:hidden"
						style={{
							backgroundColor: "var(--background-primary)",
							borderColor: "var(--border-primary)",
							borderBottomWidth: "1px",
						}}
					>
						<nav className="container mx-auto px-3 py-1">
							{menuItems.map((item) => (
								<Link
									key={item.to}
									to={item.to}
									onClick={() => setIsMenuOpen(false)}
									className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5"
									style={{
										color: "var(--text-secondary)",
									}}
								>
									{item.icon && <span className="mr-2">{item.icon}</span>}
									{item.label}
								</Link>
							))}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};
