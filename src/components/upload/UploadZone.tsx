import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { FilePreview } from "./FilePreview";

// List of MIME types that can be previewed in the browser
const PREVIEWABLE_TYPES = [
	"image/",
	"application/pdf",
	"text/",
	"video/",
	"audio/",
];

export const UploadZone = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [previewFile, setPreviewFile] = useState<File | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles((prev) => [...prev, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: true,
	});

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const canPreview = (file: File) => {
		return PREVIEWABLE_TYPES.some((type) => file.type.startsWith(type));
	};

	const handleUpload = async () => {
		if (files.length === 0) {
			toast.error("Please select files to upload");
			return;
		}

		setUploading(true);
		// TODO: Implement file upload logic
		try {
			// Simulating upload
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast.success("Files uploaded successfully!");
			setFiles([]);
		} catch (error) {
			toast.error("Failed to upload files");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6">
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-xl p-8 py-16 md:py-20 text-center cursor-pointer transition-colors backdrop-blur-lg bg-opacity-10`}
				style={{
					backgroundColor: "var(--background-card)",
					borderColor: "var(--border-secondary)",
				}}
			>
				<input {...getInputProps()} />
				<Upload
					className="w-12 h-12 mx-auto mb-4"
					style={{ color: "var(--text-primary)" }}
				/>
				<p
					className="text-lg font-medium"
					style={{ color: "var(--text-primary)" }}
				>
					{isDragActive ? "Drop files here" : "Drag & drop files here"}
				</p>
				<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
					or click to select files
				</p>
			</div>

			<AnimatePresence>
				{files.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="mt-6 space-y-4"
					>
						{files.map((file, index) => (
							<motion.div
								key={`${file.name}-${index}`}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								className="flex items-center justify-between p-4 rounded-lg shadow-sm"
								style={{
									backgroundColor: "var(--background-card)",
									borderColor: "var(--border-primary)",
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
									</div>
								</div>
								<div className="flex items-center gap-2">
									{canPreview(file) && (
										<button
											onClick={() => setPreviewFile(file)}
											className="p-1 rounded-full hover:bg-opacity-10 transition-colors"
											style={{
												backgroundColor: "var(--background-tertiary)",
												flexShrink: 0,
											}}
											title="Preview file"
										>
											<Eye
												className="w-5 h-5"
												style={{ color: "var(--text-secondary)" }}
											/>
										</button>
									)}
									<button
										onClick={() => removeFile(index)}
										className="p-1 rounded-full hover:bg-opacity-10 transition-colors"
										style={{
											backgroundColor: "var(--background-tertiary)",
											flexShrink: 0,
										}}
										title="Remove file"
									>
										<X
											className="w-5 h-5"
											style={{ color: "var(--text-secondary)" }}
										/>
									</button>
								</div>
							</motion.div>
						))}

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleUpload}
							disabled={uploading}
							className="w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							style={{
								backgroundColor: "var(--button-primary)",
								color: "var(--text-inverted)",
							}}
						>
							{uploading ? "Uploading..." : "Upload Files"}
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>

			<Modal
				isOpen={previewFile !== null}
				onClose={() => setPreviewFile(null)}
				title="File Preview"
			>
				{previewFile && (
					<FilePreview
						file={previewFile}
						onClose={() => setPreviewFile(null)}
					/>
				)}
			</Modal>
		</div>
	);
};
