import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const UploadZone = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);

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
				className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${
						isDragActive
							? "border-primary bg-primary/5"
							: "border-gray-300 hover:border-primary"
					}`}
			>
				<input {...getInputProps()} />
				<Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
				<p className="text-lg font-medium text-gray-600">
					{isDragActive ? "Drop files here" : "Drag & drop files here"}
				</p>
				<p className="text-sm text-gray-500 mt-2">or click to select files</p>
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
								className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
							>
								<div className="flex items-center space-x-4">
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{file.name}
										</p>
										<p className="text-sm text-gray-500">
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>
								<button
									onClick={() => removeFile(index)}
									className="p-1 rounded-full hover:bg-gray-100"
								>
									<X className="w-5 h-5 text-gray-500" />
								</button>
							</motion.div>
						))}

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleUpload}
							disabled={uploading}
							className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
                hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
                disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{uploading ? "Uploading..." : "Upload Files"}
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
