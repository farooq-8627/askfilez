import { useState, useRef, useEffect } from "react";
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

interface FileData {
	id: string;
	name: string;
	filename: string;
	size: number;
	mimetype: string;
	uploadDate: string;
	expiryDate: string;
	downloads: number;
	groupCodes: string[];
	username: string;
}

const getStreamUrl = (code: string, file: FileData) =>
	`http://localhost:3000/api/files/stream/${code.trim().toUpperCase()}/${
		file.id
	}`;

const FilePreviewContent = ({
	file,
	code,
}: {
	file: FileData;
	code: string;
}) => {
	const streamUrl = getStreamUrl(code, file);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [videoError, setVideoError] = useState<string | null>(null);

	useEffect(() => {
		setVideoError(null);
	}, [file]);

	if (file.mimetype.startsWith("image/")) {
		return (
			<div className="flex justify-center">
				<img
					src={streamUrl}
					alt={file.name}
					className="max-w-full max-h-[70vh] object-contain"
				/>
			</div>
		);
	}

	if (file.mimetype.startsWith("video/")) {
		return (
			<div className="flex flex-col items-center">
				<video
					ref={videoRef}
					controls
					autoPlay
					playsInline
					className="max-w-full max-h-[70vh]"
					style={{ backgroundColor: "black" }}
					onError={(e) => {
						console.error("Video error:", e);
						setVideoError(
							"Error loading video. Please try downloading instead."
						);
					}}
				>
					<source src={streamUrl} type={file.mimetype} />
					Your browser does not support the video tag.
				</video>
				{videoError && <p className="text-red-500 mt-2">{videoError}</p>}
			</div>
		);
	}

	if (file.mimetype.startsWith("audio/")) {
		return (
			<div className="flex justify-center p-4">
				<audio controls className="w-full">
					<source src={streamUrl} type={file.mimetype} />
					Your browser does not support the audio tag.
				</audio>
			</div>
		);
	}

	if (file.mimetype === "application/pdf") {
		return (
			<div className="w-full h-[70vh]">
				<object
					data={streamUrl}
					type="application/pdf"
					className="w-full h-full"
				>
					<iframe
						src={`https://docs.google.com/viewer?url=${encodeURIComponent(
							streamUrl
						)}&embedded=true`}
						className="w-full h-full"
						title={file.name}
					>
						This browser does not support PDFs.
						<a href={streamUrl} target="_blank" rel="noopener noreferrer">
							Download PDF
						</a>
					</iframe>
				</object>
			</div>
		);
	}

	if (file.mimetype.startsWith("text/")) {
		return (
			<iframe src={streamUrl} className="w-full h-[70vh]" title={file.name} />
		);
	}

	return (
		<div className="text-center p-4" style={{ color: "var(--text-primary)" }}>
			<p>Preview not available for this file type.</p>
			<p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
				You can download the file to view it.
			</p>
		</div>
	);
};

export const SearchFiles = () => {
	const [code, setCode] = useState("");
	const [searching, setSearching] = useState(false);
	const [files, setFiles] = useState<FileData[]>([]);
	const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
	const [showPreview, setShowPreview] = useState(false);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) {
			toast.error("Please enter a file code");
			return;
		}

		setSearching(true);
		try {
			const response = await fetch(
				`http://localhost:3000/api/files/group/${code.trim().toUpperCase()}`
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to find files");
			}

			const data = await response.json();
			console.log("Search results:", data);
			setFiles(data);
		} catch (error) {
			console.error("Search error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to find files"
			);
			setFiles([]);
		} finally {
			setSearching(false);
		}
	};

	const handleDownload = async (file: FileData) => {
		try {
			console.log("Attempting to download file:", file);

			// Use file._id for downloading
			const downloadUrl = `http://localhost:3000/api/files/download/${code
				.trim()
				.toUpperCase()}/${file.id}`;
			console.log("Download URL:", downloadUrl);

			toast.loading("Preparing download...");
			const response = await fetch(downloadUrl);

			if (!response.ok) {
				const error = await response
					.json()
					.catch(() => ({ error: "Download failed" }));
				throw new Error(error.error || "Failed to download file");
			}

			// Create a blob from the response
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			// Create an invisible download link
			const link = document.createElement("a");
			link.href = url;
			link.download = file.name; // Use original file name for the downloaded file

			// Set download attribute to force download to Downloads folder
			link.setAttribute("download", file.name);

			// Append to body, click, and cleanup
			document.body.appendChild(link);
			link.click();

			// Cleanup
			window.URL.revokeObjectURL(url);
			document.body.removeChild(link);

			toast.dismiss();
			toast.success("Download started");
		} catch (error) {
			toast.dismiss();
			console.error("Download error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to download file"
			);
		}
	};

	const canPreview = (file: FileData) => {
		return PREVIEWABLE_TYPES.some((type) => file.mimetype.startsWith(type));
	};

	const renderGroupCodes = (file: FileData, currentCode: string) => {
		// Remove this function as we don't want to show other group codes
		return null;
	};

	return (
		<div className="w-full max-w-2xl mx-auto p-6">
			<form onSubmit={handleSearch} className="space-y-6">
				<div className="relative">
					<input
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="Enter file code (e.g., AB12CD34)"
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
					className="w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					style={{
						backgroundColor: "var(--button-primary)",
						color: "var(--text-inverted)",
					}}
				>
					{searching ? "Searching..." : "Search Files"}
				</motion.button>
			</form>

			<AnimatePresence>
				{files.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="mt-6 space-y-4"
					>
						{files.map((file) => (
							<motion.div
								key={file.id}
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
											Uploaded by: {file.username}
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
											Expires: {new Date(file.expiryDate).toLocaleDateString()}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handleDownload(file)}
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
											onClick={() => {
												setSelectedFile(file);
												setShowPreview(true);
											}}
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
						))}
					</motion.div>
				)}
			</AnimatePresence>

			<Modal
				isOpen={showPreview && selectedFile !== null}
				onClose={() => {
					setShowPreview(false);
					setSelectedFile(null);
				}}
				title="File Preview"
			>
				{selectedFile && <FilePreviewContent file={selectedFile} code={code} />}
			</Modal>
		</div>
	);
};
