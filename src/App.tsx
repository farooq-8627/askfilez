import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/layout/Header";
import { UploadZone } from "./components/upload/UploadZone";
import { SearchFiles } from "./components/search/SearchFiles";
import { FileStats } from "./components/stats/FileStats";
import { ThemeProvider } from "./theme/ThemeContext";

import "./App.css";
import { About } from "./components/about/about";

function App() {
	return (
		<ThemeProvider>
			<Router>
				<div className="min-h-screen">
					<Toaster
						position="top-right"
						toastOptions={{
							style: {
								background: "var(--background-card)",
								color: "var(--text-primary)",
								border: "1px solid var(--border-primary)",
							},
						}}
					/>
					<Header />

					<main className="pt-20 pb-12">
						<Routes>
							<Route path="/" element={<UploadZone />} />
							<Route path="/analytics" element={<FileStats />} />
							<Route path="/search" element={<SearchFiles />} />
							<Route path="/about" element={<About />} />
						</Routes>
					</main>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
