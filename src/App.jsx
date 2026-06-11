// ─────────────────────────────────────────────────────────────────────────────
// APP.JS — The root component that sets up page routing
// ─────────────────────────────────────────────────────────────────────────────
// In a traditional server-rendered app (Spring + Thymeleaf), each URL is a
// separate HTTP request to the server, which returns a full HTML page.
//
// In React (SPA), the browser loads ONE HTML page, and JavaScript handles
// navigation by showing/hiding components. The URL changes but NO server
// request is made for the page itself (only API calls for data).
//
// react-router-dom makes this work by:
//   - Watching the browser URL
//   - Rendering the component that matches the current path
//   - Updating the URL when you navigate (without page reload)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
// ▲ Import React library. Required in every component file.
//   In newer React (17+), this import is technically optional for JSX,
//   but it's good practice to include it for clarity.

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ▲ Import routing components:
//   BrowserRouter (aliased as Router) — wraps your entire app to enable routing
//   Routes — container for all your route definitions
//   Route — maps a URL path to a component
//   Navigate — programmatic redirect (like Spring's "redirect:/login")

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // Router wraps everything — enables URL-based navigation
    // Spring equivalent: This is like your DispatcherServlet + ViewResolver
    <Router>
      <Routes>
        {/* /login → show Login component */}
        <Route path="/login" element={<Login />} />

        {/* /signup → show Signup component */}
        <Route path="/signup" element={<Signup />} />

        {/* /dashboard → show Dashboard component (protected inside) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* / (root) → redirect to login */}
        {/* Navigate replaces the URL — like "redirect:/login" in Spring */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;