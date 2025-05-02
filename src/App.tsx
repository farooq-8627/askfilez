import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/layout/Header";
import { UploadZone } from "./components/upload/UploadZone";
import { SearchFiles } from "./components/search/SearchFiles";
import { FileStats } from "./components/stats/FileStats";

import "./App.css";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Toaster position="top-right" />
				<Header />

				<main className="pt-20 pb-12">
					<Routes>
						<Route path="/" element={<FileStats />} />
						<Route path="/upload" element={<UploadZone />} />
						<Route path="/search" element={<SearchFiles />} />
						<Route
							path="/about"
							element={
								<div className="max-w-3xl mx-auto p-6">
									<h1 className="text-3xl font-bold text-gray-900 mb-6">
										About AskFilez
									</h1>
									<div className="prose prose-gray">
										<p>
											AskFilez is a simple and secure file sharing platform that
											allows you to share files with anyone using unique codes.
											Files are stored for 21 days and then automatically
											deleted to ensure privacy and security.
										</p>
										<h2>How it works</h2>
										<ol>
											<li>Upload your files (any type, any size)</li>
											<li>Get a unique code for your files</li>
											<li>Share the code with your recipients</li>
											<li>Recipients use the code to download files</li>
										</ol>
										<p>
											Your files are encrypted and stored securely. They are
											automatically deleted after 21 days to maintain privacy
											and free up storage space.
										</p>
									</div>
								</div>
							}
						/>
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
