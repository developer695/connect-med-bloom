import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProposalContentProvider } from "@/contexts/ProposalContentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PublicProposal from "./pages/PublicProposal";
import ProposalViewer from "./pages/ProposalViewer";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import AuthCallback from "./pages/AuthCallback";
import AcceptInvitation from "./components/proposal/pages/AcceptInvitation";
import ResetPassword from "./pages/SendPassword";
import SendPassword from "./pages/SendPassword";
import ResetPasswordPage from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Routes>
            {/* ✅ Accept Invitation - NO AUTH REQUIRED (must be before protected routes) */}
            <Route path="/accept-invitation" element={<AcceptInvitation />} />

            {/* ✅ Auth Pages */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/send-password" element={<SendPassword />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* ✅ Public View Routes - Read-only */}
            <Route
              path="/proposal/:viewToken"
              element={
                <ProposalContentProvider readOnly={true}>
                  <PublicProposal />
                </ProposalContentProvider>
              }
            />

            <Route
              path="/view/:shareId"
              element={
                <ProposalContentProvider readOnly={true}>
                  <ProposalViewer />
                </ProposalContentProvider>
              }
            />

            {/* ✅ Protected Editor Route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />

            {/* ✅ 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
