import { Link } from "react-router-dom";
import { Upload, Search, Info } from "lucide-react";

export const Header = () => {
	return (
		<header className="border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link
						to="/"
						className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors"
					>
						AskFilez
					</Link>

					<nav className="flex items-center space-x-1">
						<Link
							to="/upload"
							className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all"
						>
							<Upload className="w-4 h-4 mr-2" />
							Upload
						</Link>
						<Link
							to="/search"
							className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all"
						>
							<Search className="w-4 h-4 mr-2" />
							Search
						</Link>
						<Link
							to="/about"
							className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all"
						>
							<Info className="w-4 h-4 mr-2" />
							About
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};
