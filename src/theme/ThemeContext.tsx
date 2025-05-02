import { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeColor, darkTheme, lightTheme } from "./theme.config";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	mode: ThemeMode;
	toggleTheme: () => void;
	setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setMode] = useState<ThemeMode>(() => {
		// Check local storage or system preference
		const savedTheme = localStorage.getItem("theme-mode") as ThemeMode;
		if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

	// Set the theme based on mode
	const theme = mode === "light" ? lightTheme : darkTheme;

	useEffect(() => {
		// Update document class and local storage when theme changes
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(mode);
		localStorage.setItem("theme-mode", mode);

		// Update CSS variables
		Object.entries(theme).forEach(([category, values]) => {
			Object.entries(values).forEach(([key, value]) => {
				document.documentElement.style.setProperty(
					`--${category}-${key}`,
					value.toString()
				);
			});
		});
	}, [mode, theme]);

	const toggleTheme = () => {
		setMode((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, mode, toggleTheme, setMode }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
