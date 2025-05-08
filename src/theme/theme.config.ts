export const lightTheme = {
	background: {
		primary: "#ffffff",
		secondary: "#EBF8FF",
		tertiary: "#E3F5FF",
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
		primary: "#4FB3E7",
		secondary: "#38A3DC",
		tertiary: "#2B94D1",
		light: "#EBF8FF",
	},
	accent: {
		primary: "#4FB3E7",
		hover: "#38A3DC",
		pressed: "#2B94D1",
		light: "#EBF8FF",
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
		primary: "#0A2540",
		secondary: "#0E2D4A",
		tertiary: "#143454",
		card: "#0A2540",
	},
	text: {
		primary: "#f8fafc",
		secondary: "#e2e8f0",
		tertiary: "#94a3b8",
		inverted: "#0f172a",
	},
	border: {
		primary: "#1A3A5F",
		secondary: "#234567",
	},
	button: {
		primary: "#2D7AB8",
		secondary: "#1E6CA8",
		tertiary: "#155C96",
		light: "#0A2540",
	},
	accent: {
		primary: "#2D7AB8",
		hover: "#3D8AC8",
		pressed: "#1E6CA8",
		light: "#0A2540",
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
