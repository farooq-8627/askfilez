import { useState } from "react";
import { Search, Download, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { FilePreview } from "../upload/FilePreview";

// List of MIME types that can be previewed in the browser
const PREVIEWABLE_TYPES = [
	"image/",
	"application/pdf",
	"text/",
	"video/",
	"audio/",
];

export const SearchFiles = () => {
	const [code, setCode] = useState("");
	const [searching, setSearching] = useState(false);
	const [file, setFile] = useState<any>(null);
	const [showPreview, setShowPreview] = useState(false);

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
			const mockFile = new File([""], "example-file.pdf", {
				type: "application/pdf",
			});
			setFile({
				file: mockFile,
				name: "example-file.pdf",
				size: 1024 * 1024 * 2.5, // 2.5MB
				type: "application/pdf",
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

	const handleDownload = async () => {
		try {
			// TODO: Implement actual download logic
			// For now, we'll simulate a download delay
			toast.loading("Preparing download...");
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Create a mock download link
			const link = document.createElement("a");
			link.href = URL.createObjectURL(file.file);
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("Download started");
		} catch (error) {
			toast.error("Failed to download file");
		}
	};

	const canPreview = (file: any) => {
		return PREVIEWABLE_TYPES.some((type) => file.type.startsWith(type));
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
						className="w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
						style={{
							backgroundColor: "var(--background-primary)",
							color: "var(--text-primary)",
							borderColor: "var(--border-primary)",
						}}
					/>
					<Search
						className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2"
						style={{ color: "var(--text-secondary)" }}
					/>
				</div>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type="submit"
					disabled={searching}
					className="w-full py-3 px-4 rounded-lg font-medium
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					style={{
						backgroundColor: "var(--button-primary)",
						color: "var(--text-inverted)",
					}}
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
						className="mt-6"
					>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							className="flex items-center justify-between p-4 rounded-lg shadow-sm"
							style={{
								backgroundColor: "var(--background-card)",
								borderColor: "var(--border-primary)",
								border: "1px solid var(--border-primary)",
							}}
						>
							<div className="flex items-center flex-1 min-w-0 pr-4">
								<div className="flex-1 min-w-0">
									<p
										className="text-sm font-medium truncate"
										style={{
											color: "var(--text-primary)",
											maxWidth: "100%",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{file.name}
									</p>
									<p
										className="text-sm"
										style={{ color: "var(--text-secondary)" }}
									>
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
									<p
										className="text-sm"
										style={{ color: "var(--text-secondary)" }}
									>
										Expires: {new Date(file.expiresAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={handleDownload}
									className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
									style={{
										backgroundColor: "var(--button-primary)",
										color: "var(--text-inverted)",
									}}
									title="Download file"
								>
									<Download className="w-5 h-5" />
								</button>
								{canPreview(file) && (
									<button
										onClick={() => setShowPreview(true)}
										className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
										style={{
											backgroundColor: "var(--background-tertiary)",
											color: "var(--text-secondary)",
										}}
										title="Preview file"
									>
										<Eye className="w-5 h-5" />
									</button>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<Modal
				isOpen={showPreview && file !== null}
				onClose={() => setShowPreview(false)}
				title="File Preview"
			>
				{file && (
					<FilePreview file={file.file} onClose={() => setShowPreview(false)} />
				)}
			</Modal>
		</div>
	);
};
