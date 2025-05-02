import { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const SearchFiles = () => {
	const [code, setCode] = useState("");
	const [searching, setSearching] = useState(false);
	const [file, setFile] = useState<any>(null);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) {
			toast.error("Please enter a file code");
			return;
		}

		setSearching(true);
		try {
			// TODO: Implement actual search logic
			await new Promise((resolve) => setTimeout(resolve, 1500));
			// Simulated file data
			setFile({
				name: "example-file.pdf",
				size: 1024 * 1024 * 2.5, // 2.5MB
				uploadedAt: new Date().toISOString(),
				expiresAt: new Date(
					Date.now() + 1000 * 60 * 60 * 24 * 21
				).toISOString(), // 21 days
			});
		} catch (error) {
			toast.error("File not found");
			setFile(null);
		} finally {
			setSearching(false);
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto p-6">
			<form onSubmit={handleSearch} className="space-y-6">
				<div className="relative">
					<input
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="Enter file code (e.g., d3g45h)"
						className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
					/>
					<Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
				</div>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type="submit"
					disabled={searching}
					className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				>
					{searching ? "Searching..." : "Search File"}
				</motion.button>
			</form>

			<AnimatePresence>
				{file && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
					>
						<h3 className="text-lg font-semibold text-gray-900">{file.name}</h3>
						<div className="mt-4 space-y-2">
							<p className="text-sm text-gray-600">
								Size: {(file.size / 1024 / 1024).toFixed(2)} MB
							</p>
							<p className="text-sm text-gray-600">
								Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
							</p>
							<p className="text-sm text-gray-600">
								Expires: {new Date(file.expiresAt).toLocaleDateString()}
							</p>
						</div>
						<div className="mt-6 flex space-x-4">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="flex-1 py-2 px-4 bg-primary text-white rounded-lg font-medium
                  hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
                  transition-all"
							>
								Download
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium
                  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200
                  transition-all"
							>
								View Details
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
