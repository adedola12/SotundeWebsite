import React from "react";
import ReactDom from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import AboutProjectManagement from "./pages/AboutProjectManagement.jsx";
import AboutQuantitySurveying from "./pages/AboutQuantitySurveying.jsx";
import Speeches from "./pages/Speeches.jsx";
import SpeechDetail from "./pages/SpeechDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import ThoughtLeadership from "./pages/ThoughtLeadership.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Lifestyle from "./pages/Lifestyle.jsx";
import Library from "./pages/Library.jsx";
import Videos from "./pages/Videos.jsx";
import News from "./pages/News.jsx";
import SignUp from "./pages/SignUp.jsx";
import Contact from "./pages/Contact.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminAuthPage from "./pages/admin/AdminAuthPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // About with sub-pages
      { path: "about", element: <About /> },
      { path: "about/project-management", element: <AboutProjectManagement /> },
      { path: "about/quantity-surveying", element: <AboutQuantitySurveying /> },

      { path: "speeches", element: <Speeches /> },
      { path: "speeches/:slug", element: <SpeechDetail /> },
      { path: "gallery", element: <Gallery /> },
      { path: "thought-leadership", element: <ThoughtLeadership /> },
      { path: "thought-leadership/:slug", element: <BlogDetail /> },
      { path: "lifestyle", element: <Lifestyle /> },
      { path: "library", element: <Library /> },
      { path: "videos", element: <Videos /> },
      { path: "news", element: <News /> },
      { path: "signup", element: <SignUp /> },
      { path: "contact", element: <Contact /> },

      { path: "admin-auth", element: <AdminAuthPage /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // 404 catch-all
      {
        path: "*",
        element: (
          <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900">
            <h1 className="text-5xl font-bold text-gray-300">404</h1>
            <p className="mt-2 text-gray-400">Page not found</p>
            <a href="/" className="mt-4 text-red-500 hover:underline text-sm">Go home</a>
          </div>
        ),
      },
    ],
  },
]);

ReactDom.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
