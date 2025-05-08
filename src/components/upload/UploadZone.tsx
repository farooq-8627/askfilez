import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
	Upload,
	X,
	Eye,
	FileIcon,
	Image,
	Film,
	Music,
	FileText,
	FileArchive,
	Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { FilePreview } from "./FilePreview";
import { format } from "date-fns";

// List of MIME types that can be previewed in the browser
const PREVIEWABLE_TYPES = [
	"image/",
	"application/pdf",
	"text/",
	"video/",
	"audio/",
];

const getFileIcon = (file: File) => {
	const type = file.type.toLowerCase();

	if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
	if (type.startsWith("video/")) return <Film className="w-6 h-6" />;
	if (type.startsWith("audio/")) return <Music className="w-6 h-6" />;
	if (type.startsWith("text/")) return <FileText className="w-6 h-6" />;
	if (type === "application/pdf") return <FileText className="w-6 h-6" />;
	if (
		type.includes("zip") ||
		type.includes("compressed") ||
		type.includes("archive")
	)
		return <FileArchive className="w-6 h-6" />;
	if (
		type.includes("javascript") ||
		type.includes("typescript") ||
		type.includes("json")
	)
		return <Code className="w-6 h-6" />;

	return <FileIcon className="w-6 h-6" />;
};

// Helper function to check for duplicate files
const isDuplicateFile = (file: File, existingFiles: File[]) => {
	return existingFiles.some(
		(existingFile) =>
			existingFile.name === file.name &&
			existingFile.size === file.size &&
			existingFile.type === file.type
	);
};

export const UploadZone = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [username, setUsername] = useState<string>("");
	const [uploadResult, setUploadResult] = useState<{
		groupCodes: string[];
		files: Array<{
			name: string;
			size: number;
			uploadDate: string;
			expiryDate: string;
			groupCode: string;
			username: string;
		}>;
	} | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			// Check for duplicates before adding
			const newFiles = acceptedFiles.filter(
				(file) => !isDuplicateFile(file, files)
			);

			// If there are duplicates, show warning
			if (newFiles.length < acceptedFiles.length) {
				toast.error("Some files were skipped as they were already selected");
			}

			setFiles((prev) => [...prev, ...newFiles]);
		},
		[files]
	);

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

		if (!username.trim()) {
			toast.error("Please enter your name");
			return;
		}

		setUploading(true);
		const uploadResults = [];
		let sessionGroupCode = null;

		try {
			// Upload each file individually
			for (const file of files) {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("username", username.trim());
				if (sessionGroupCode) {
					formData.append("groupCode", sessionGroupCode);
				}

				console.log("Uploading file:", file.name);
				const response = await fetch("http://localhost:3000/api/files/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response
						.json()
						.catch(() => ({ error: "Unknown error" }));
					throw new Error(errorData.error || `Upload failed for ${file.name}`);
				}

				const data = await response.json();
				console.log("Upload response:", data);

				// Store the group code from the first file for subsequent uploads
				if (!sessionGroupCode) {
					sessionGroupCode = data.file.groupCode;
				}

				uploadResults.push({
					name: data.file.name,
					filename: data.file.filename,
					size: data.file.size,
					uploadDate: data.file.uploadDate,
					expiryDate: data.file.expiryDate,
					groupCode: sessionGroupCode,
					username: data.file.username,
				});
			}

			console.log("All upload results:", uploadResults);

			// Group the results
			const uniqueFiles = new Map();
			uploadResults.forEach((result) => {
				const key = `${result.name}-${result.size}`;
				uniqueFiles.set(key, result);
			});

			setUploadResult({
				files: Array.from(uniqueFiles.values()),
				groupCodes: [sessionGroupCode], // Only show the session group code
			});

			toast.success("Files uploaded successfully!");
			setFiles([]);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to upload files"
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6">
			<div className="mb-4">
				<input
					type="text"
					placeholder="Enter your name"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full p-2 rounded-lg border"
					style={{
						backgroundColor: "var(--background-card)",
						borderColor: "var(--border-secondary)",
						color: "var(--text-primary)",
					}}
				/>
			</div>
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
									<div
										className="flex-shrink-0 mr-3"
										style={{ color: "var(--text-secondary)" }}
									>
										{getFileIcon(file)}
									</div>
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
								backgroundColor: "var(--button-secondary)",
								color: "var(--text-inverted)",
							}}
						>
							{uploading ? "Uploading..." : "Upload Files"}
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{uploadResult && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="mt-6 p-4 rounded-lg"
						style={{
							backgroundColor: "var(--background-card)",
							borderColor: "var(--border-primary)",
						}}
					>
						<div className="flex items-center justify-between mb-4">
							<h3
								className="text-lg font-medium"
								style={{ color: "var(--text-primary)" }}
							>
								Upload Complete!
							</h3>
							<code
								className="px-3 py-1 rounded text-lg"
								style={{
									backgroundColor: "var(--background-tertiary)",
									color: "var(--text-secondary)",
								}}
							>
								{uploadResult.groupCodes.join(", ")}
							</code>
						</div>
						<p
							className="text-sm mb-4"
							style={{ color: "var(--text-secondary)" }}
						>
							Use these codes to access all uploaded files
						</p>
						<div className="space-y-3">
							{uploadResult.files.map((file, index) => (
								<div
									key={index}
									className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded-lg"
									style={{
										backgroundColor: "var(--background-tertiary)",
									}}
								>
									<div className="flex-1 min-w-0">
										<p
											className="text-sm font-medium truncate"
											style={{ color: "var(--text-primary)" }}
										>
											{file.name}
										</p>
										<p
											className="text-xs"
											style={{ color: "var(--text-secondary)" }}
										>
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
									<div
										className="text-xs mt-1 sm:mt-0 sm:ml-4"
										style={{ color: "var(--text-secondary)" }}
									>
										<p>Uploaded by: {file.username}</p>
										<p>Uploaded: {format(new Date(file.uploadDate), "PPp")}</p>
										<p>Expires: {format(new Date(file.expiryDate), "PPp")}</p>
									</div>
								</div>
							))}
						</div>
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
