import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

export function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;