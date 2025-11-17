import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NetworkMap from "./pages/NetworkMap";
import Devices from "./pages/Devices";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import Plans from "./pages/Plans";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Junctions from "./pages/Junction";
import Olt from "./pages/Olt";
import HomePage from "./pages/HomePage";
import Add from "./pages/Add";
import SubOffice from "./pages/SubOffice";
import StaffList from "./pages/StaffList";
import ForgotPassword from "./pages/ForgotPassword";

Navigate;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            {/* You can add a /signup route if you want a direct link */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <NetworkMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/olt"
              element={
                <ProtectedRoute>
                  <Olt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Add />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Devices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/junctions"
              element={
                <ProtectedRoute>
                  <Junctions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sub"
              element={
                <ProtectedRoute>
                  <SubOffice />
                </ProtectedRoute>
              }
            />
            <Route path="/payments" element={<Payments />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/settings" element={<Settings />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
