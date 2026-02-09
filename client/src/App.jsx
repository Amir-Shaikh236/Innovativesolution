import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "./api";

import Footer from './components/Footer';
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import Subpage from "./pages/Subpage";
import BlogOverviewPage from './pages/BlogOverviewPage';
import Signup from './pages/auth/Signup';
import OtpVerify from './pages/auth/OtpVerify';
import Login from './pages/auth/Login';
import PasswordReset from './pages/auth/PasswordReset';
import ContactPage from './pages/ContactPage'
import JoinAsTalent from './pages/JoinAsTalent';
import TeamUpRequest from './pages/TeamUpRequest';
import CategoryOverviewPage from './pages/CategoryOverviewPage';
import BlogPage from './pages/BlogPage';
import Careers from "./pages/Careers";
import CaseStudy from "./pages/CaseStudy";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import IndustriesPage from "./pages/IndustriesPage";
import IndustryPlaybookPage from "./pages/IndustryPlaybookPage";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import FAQsPage from './pages/FAQsPage';
import Chatbot from "./components/Chatbot";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const handleVerified = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    }
  };

  const RequireAuth = ({ children }) => {
    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RedirectIfAuth = ({ children }) => {
    if (isLoading) return null;

    if (isLoggedIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const startAuthFlow = () => {
    if (isLoggedIn) {
      navigate('/join-as-talent');
    } else {
      navigate('/login');
    }
  };

  // Global Loading State (Blocks the whole app until we know if user is logged in)
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage onJoinAsTalent={startAuthFlow} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/subpage/:slug" element={<Subpage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogOverviewPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/case-studies" element={<CaseStudy />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/industries/:slug" element={<IndustryPlaybookPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/category/:slug" element={<CategoryOverviewPage />} />

        {/* Auth Routes Wrapped in RedirectIfAuth */}
        <Route path="/login" element={<RedirectIfAuth><Login onVerified={handleVerified} /></RedirectIfAuth>} />
        <Route path="/signup" element={<RedirectIfAuth><Signup /></RedirectIfAuth>} />
        <Route path="/verify-email" element={<RedirectIfAuth><OtpVerify onVerified={handleVerified} /></RedirectIfAuth>} />

        <Route path="/forgot-password" element={<RedirectIfAuth><ForgotPassword /></RedirectIfAuth>} />
        <Route path="/passwordreset/:resetToken" element={<RedirectIfAuth><PasswordReset /></RedirectIfAuth>} />

        {/* Protected Routes Wrapped in RequireAuth */}
        <Route path="/join-as-talent" element={<RequireAuth><JoinAsTalent /></RequireAuth>} />

        <Route path="/team-up-request" element={<TeamUpRequest />} />
      </Routes>
      <Chatbot />
      <Footer />
    </>
  );
}

export default App;