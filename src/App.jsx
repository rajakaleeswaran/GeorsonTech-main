import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopBar from "./components/TopBar";

import Home     from "./pages/Home";
import About    from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Clients  from "./pages/Clients";
import Blog     from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Enquiry  from "./pages/Enquiry";
import Admin    from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useVisitorTracker } from "./hooks/useVisitorTracker";

function App() {
  useVisitorTracker();
  return (
    <HelmetProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <TopBar />
        <ScrollToTop />
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/clients"   element={<Clients />} />
            <Route path="/blog"      element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/enquiry"   element={<Enquiry />} />
            <Route path="/admin"     element={<Admin />} />
            <Route path="*"          element={<NotFound />} />
          </Routes>
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