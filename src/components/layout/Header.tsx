import { Link } from "react-router-dom";
import { Search, Info, Sun, Moon, ChartBar } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

export const Header = () => {
	const { mode, toggleTheme } = useTheme();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
			<div
				className="border-b card"
				style={{
					backgroundColor: "var(--background-primary)",
					borderColor: "var(--border-primary)",
				}}
			>
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-2">
						<Link
							to="/"
							className="text-2xl font-bold transition-colors"
							style={{
								color: "var(--text-primary)",
							}}
						>
							AskFilez
						</Link>

						<nav className="flex items-center space-x-1">
							<Link
								to="/analytics"
								className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
								style={{
									color: "var(--text-secondary)",
								}}
							>
								<ChartBar className="w-4 h-4 mr-2" />
								Analytics
							</Link>
							<Link
								to="/search"
								className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
								style={{
									color: "var(--text-secondary)",
								}}
							>
								<Search className="w-4 h-4 mr-2" />
								Search
							</Link>
							<Link
								to="/about"
								className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
								style={{
									color: "var(--text-secondary)",
								}}
							>
								<Info className="w-4 h-4 mr-2" />
								About
							</Link>
							<button
								onClick={toggleTheme}
								className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all"
								style={{
									color: "var(--text-secondary)",
								}}
								aria-label="Toggle theme"
							>
								{mode === "light" ? (
									<Moon className="w-5 h-5" />
								) : (
									<Sun className="w-5 h-5" />
								)}
							</button>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
};
