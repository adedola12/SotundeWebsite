import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Nav />
      <ScrollToTop />

      <main className="w-full flex-1 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
