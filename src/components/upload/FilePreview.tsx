import { useState, useEffect } from "react";
import {
	FileIcon,
	FileText,
	Image,
	Film,
	Music,
	FileQuestion,
} from "lucide-react";

interface FilePreviewProps {
	file: File;
	onClose: () => void;
}

export const FilePreview = ({ file, onClose }: FilePreviewProps) => {
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		setLoading(false);

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [file]);

	const getFileIcon = () => {
		if (file.type.startsWith("image/")) return <Image className="w-6 h-6" />;
		if (file.type.startsWith("video/")) return <Film className="w-6 h-6" />;
		if (file.type.startsWith("audio/")) return <Music className="w-6 h-6" />;
		if (file.type.startsWith("text/") || file.type === "application/pdf")
			return <FileText className="w-6 h-6" />;
		return <FileQuestion className="w-6 h-6" />;
	};

	const renderPreview = () => {
		if (loading) {
			return (
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-2 border-t-primary" />
				</div>
			);
		}

		if (error) {
			return (
				<div className="flex flex-col items-center justify-center h-64 space-y-4">
					<FileIcon
						className="w-12 h-12"
						style={{ color: "var(--error-primary)" }}
					/>
					<p className="text-sm" style={{ color: "var(--error-primary)" }}>
						{error}
					</p>
				</div>
			);
		}

		if (file.type.startsWith("image/")) {
			return (
				<img
					src={previewUrl}
					alt={file.name}
					className="max-w-full h-auto max-h-[70vh] object-contain mx-auto"
					onError={() => setError("Failed to load image")}
				/>
			);
		}

		if (file.type.startsWith("video/")) {
			return (
				<div className="flex items-center justify-center">
					<video
						src={previewUrl}
						controls
						className="max-w-full max-h-[70vh] rounded-xl"
						onError={() => setError("Failed to load video")}
					>
						Your browser does not support the video tag.
					</video>
				</div>
			);
		}

		if (file.type.startsWith("audio/")) {
			return (
				<div className="flex flex-col items-center space-y-4 p-8">
					<Music
						className="w-16 h-16"
						style={{ color: "var(--text-secondary)" }}
					/>
					<audio
						src={previewUrl}
						controls
						className="w-full"
						onError={() => setError("Failed to load audio")}
					>
						Your browser does not support the audio tag.
					</audio>
				</div>
			);
		}

		if (file.type === "application/pdf") {
			return (
				<iframe
					src={previewUrl}
					className="w-full h-[70vh]"
					title={file.name}
					onError={() => setError("Failed to load PDF")}
				/>
			);
		}

		if (file.type.startsWith("text/")) {
			return (
				<div
					className="w-full h-[70vh] overflow-auto p-4 font-mono text-sm whitespace-pre-wrap rounded-lg"
					style={{
						backgroundColor: "var(--background-tertiary)",
						color: "var(--text-primary)",
					}}
				>
					<object
						data={previewUrl}
						type={file.type}
						className="w-full h-full"
						onError={() => setError("Failed to load text file")}
					>
						Unable to display text content
					</object>
				</div>
			);
		}

		return (
			<div className="flex flex-col items-center justify-center h-64 space-y-4">
				{getFileIcon()}
				<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
					Preview not available for this file type
				</p>
			</div>
		);
	};

	return (
		<div className="w-full">
			<div className="flex items-center space-x-2 mb-4">
				{getFileIcon()}
				<div className="flex-1 min-w-0">
					<p
						className="text-sm font-medium truncate"
						style={{ color: "var(--text-primary)" }}
					>
						{file.name}
					</p>
					<p className="text-sm" style={{ color: "var(--text-secondary)" }}>
						{(file.size / 1024 / 1024).toFixed(2)} MB
					</p>
				</div>
			</div>
			{renderPreview()}
		</div>
	);
};
