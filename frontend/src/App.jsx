import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Scanner from "./pages/Scanner.jsx";
import ThreatIntelligence from "./pages/ThreatIntelligence.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
