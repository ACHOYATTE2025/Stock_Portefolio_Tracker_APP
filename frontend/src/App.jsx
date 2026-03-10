import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Wallet from "./pages/wallet.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Transactions from "./pages/Transactions.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { useLocation } from "react-router-dom";
import Recommandation from "./pages/Recommandation.jsx";

function AppContent() {
  const location = useLocation();
  const hideNav = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transaction"     element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/wallet"          element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/portfolio"       element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />

        {/* ✅ Les deux chemins pointent vers le même composant */}
        <Route path="/recommandation"  element={<ProtectedRoute><Recommandation /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommandation /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;