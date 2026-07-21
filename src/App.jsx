import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopBar from "./components/TopBar";
import { useVisitorTracker } from "./hooks/useVisitorTracker";

// Lazy load page components for code splitting & optimal bundle performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Products = lazy(() => import("./pages/Products"));
const Clients = lazy(() => import("./pages/Clients"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Enquiry = lazy(() => import("./pages/Enquiry"));
const Industries = lazy(() => import("./pages/Industries"));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    color: "#0a2540",
    fontWeight: "600"
  }}>
    <div style={{
      width: "40px",
      height: "40px",
      border: "3px solid #e2e8f0",
      borderTopColor: "#0284c7",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  useVisitorTracker();
  return (
    <HelmetProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <TopBar />
        <ScrollToTop />
        <Navbar />

        <div className="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/about"     element={<About />} />
              <Route path="/services"  element={<Services />} />
              <Route path="/products"  element={<Products />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:slug" element={<IndustryDetail />} />
              <Route path="/clients"   element={<Clients />} />
              <Route path="/blog"      element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/enquiry"   element={<Enquiry />} />
              <Route path="/admin"     element={<Admin />} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </div>
    </HelmetProvider>
  );
}

export default App;