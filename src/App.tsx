import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Lazy load pages for better initial load time
const Tenants = lazy(() => import("./pages/Tenants"));
const TenantDetails = lazy(() => import("./pages/TenantDetails"));
const Units = lazy(() => import("./pages/Units"));
const UnitDetails = lazy(() => import("./pages/UnitDetails"));
const AddTenant = lazy(() => import("./pages/AddTenant"));
const Payments = lazy(() => import("./pages/Payments"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Reports = lazy(() => import("./pages/Reports"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/tenants/add" element={<AddTenant />} />
                <Route path="/tenants/:id" element={<TenantDetails />} />
                <Route path="/units" element={<Units />} />
                <Route path="/units/:id" element={<UnitDetails />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
