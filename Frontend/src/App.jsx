import React from "react";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import FindDonorPage from "./pages/FindDonorPage";
import RequestPage from "./pages/RequestPage";
import InformationPage from "./pages/InformationPage";
import AboutPage from "./pages/AboutPage";
import FAQ from "./pages/FAQ";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import ProfilePage from "./pages/ProfilePage";
import DonatePage from "./pages/DonatePage";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth pages without navbar - redirect if logged in */}
        <Route path="/login" element={<PublicRoute Component={SignInPage} />} />
        <Route path="/signup" element={<PublicRoute Component={SignUpPage} />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Main app pages with navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="find-donor/:requestId" element={<FindDonorPage />} />
          <Route path="information" element={<InformationPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="faq" element={<FAQ />} />
          <Route
            path="profile"
            element={<PrivateRoute Component={ProfilePage} />}
          />
          <Route
            path="register"
            element={<PrivateRoute Component={RegisterPage} />}
          />
          <Route
            path="request"
            element={<PrivateRoute Component={RequestPage} />}
          />
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App