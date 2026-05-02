import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSupportStore } from "./features/support-widget/store/useSupportStore";
import SupportWidget from "./features/support-widget/components/SupportWidget";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WidgetEmbedPage from "./pages/WidgetEmbedPage";

function App() {
  const tenant = useAuthStore((s) => s.tenant);
  const setTenantId = useSupportStore((s) => s.setTenantId);

  useEffect(() => {
    const id = tenant?._id || tenant?.id || tenant?.slug || "default-tenant";
    setTenantId(id);
  }, [tenant, setTenantId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/embed/:tenantId" element={<WidgetEmbedPage />} />
      </Routes>

      {/* Global floating support widget */}
      <SupportWidget />
    </Router>
  );
}

export default App;
