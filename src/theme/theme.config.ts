export const lightTheme = {
	background: {
		primary: "#ffffff",
		secondary: "#f8fafc",
		tertiary: "#f1f5f9",
		card: "#ffffff",
	},
	text: {
		primary: "#0f172a",
		secondary: "#334155",
		tertiary: "#64748b",
		inverted: "#ffffff",
	},
	border: {
		primary: "#e2e8f0",
		secondary: "#cbd5e1",
	},
	button: {
		primary: "#3b82f6",
		secondary: "#2563eb",
		tertiary: "#1d4ed8",
		light: "#bfdbfe",
	},
	accent: {
		primary: "#3b82f6",
		hover: "#2563eb",
		pressed: "#1d4ed8",
		light: "#bfdbfe",
	},
	success: {
		primary: "#22c55e",
		light: "#bbf7d0",
	},
	warning: {
		primary: "#f59e0b",
		light: "#fef3c7",
	},
	error: {
		primary: "#ef4444",
		light: "#fee2e2",
	},
	shadow: {
		sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
		md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
		lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
	},
} as const;

export const darkTheme = {
	background: {
		primary: "#0f172a",
		secondary: "#1e293b",
		tertiary: "#334155",
		card: "#0f172a",
	},
	text: {
		primary: "#f8fafc",
		secondary: "#e2e8f0",
		tertiary: "#94a3b8",
		inverted: "#0f172a",
	},
	border: {
		primary: "#334155",
		secondary: "#475569",
	},
	button: {
		primary: "#3b82f6",
		secondary: "#2563eb",
		tertiary: "#1d4ed8",
		light: "#bfdbfe",
	},
	accent: {
		primary: "#3b82f6",
		hover: "#60a5fa",
		pressed: "#2563eb",
		light: "#1e3a8a",
	},
	success: {
		primary: "#22c55e",
		light: "#14532d",
	},
	warning: {
		primary: "#f59e0b",
		light: "#451a03",
	},
	error: {
		primary: "#ef4444",
		light: "#450a0a",
	},
	shadow: {
		sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
		md: "0 4px 6px -1px rgb(0 0 0 / 0.4)",
		lg: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
	},
} as const;

export type Theme = typeof lightTheme;
export type ThemeColor = keyof typeof lightTheme;
