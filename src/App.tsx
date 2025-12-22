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
import { ToastContainer } from 'react-toastify';
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
            {/* ✅ Protected Editor Route - Full editing capabilities */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <ProposalContentProvider readOnly={false}>
                    <Index />
                  </ProposalContentProvider>
                </ProtectedRoute>
              } 
            />
            
            {/* ✅ Auth Page */}
            <Route path="/auth" element={<Auth />} />
            
            {/* ✅ Public View Routes - Read-only, no edit controls */}
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
            
            {/* ✅ Protected Edit Route for specific proposal */}
           <Route 
  path="/" 
  element={
    <ProtectedRoute>
      <ProposalContentProvider readOnly={false}>
        <Index />
      </ProposalContentProvider>
    </ProtectedRoute>
  } 
/>
            
            {/* ✅ 404 Catch-all - Must be last! */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;