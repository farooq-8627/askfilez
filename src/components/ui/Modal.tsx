import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === overlayRef.current) onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={overlayRef}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={handleOverlayClick}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-lg overflow-hidden"
						style={{
							backgroundColor: "var(--background-card)",
							borderColor: "var(--border-primary)",
						}}
					>
						<div
							className="flex items-center justify-between p-4 border-b rounded-t-2xl"
							style={{ borderColor: "var(--border-primary)" }}
						>
							{title && (
								<h2
									className="text-lg font-semibold"
									style={{ color: "var(--text-primary)" }}
								>
									{title}
								</h2>
							)}
							<button
								onClick={onClose}
								className="p-1 rounded-full hover:bg-opacity-10 transition-colors ml-auto"
								style={{
									backgroundColor: "var(--background-tertiary)",
								}}
							>
								<X
									className="w-5 h-5"
									style={{ color: "var(--text-secondary)" }}
								/>
							</button>
						</div>
						<div className="p-4 overflow-auto max-h-[calc(90vh-4rem)] rounded-b-2xl">
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
