import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { lazy, Suspense } from "react";

// Lazy load prediction pages for better performance
const WingoPredictionPage = lazy(() => import("./pages/predictions/WingoPrediction"));
const TrxPredictionPage = lazy(() => import("./pages/predictions/TrxPrediction"));
const AdminPage = lazy(() => import("./pages/Admin"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#05012B]">
    <div className="w-12 h-12 border-4 border-[#00ECBE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* WinGo Prediction Routes */}
      <Route path="/predictions/wingo/:timeOption">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WingoPredictionPage timeOption={params.timeOption} />
          </Suspense>
        )}
      </Route>
      
      {/* TRX Hash Prediction Routes */}
      <Route path="/predictions/trx/:timeOption">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <TrxPredictionPage timeOption={params.timeOption} />
          </Suspense>
        )}
      </Route>
      
      {/* Admin Dashboard Route */}
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}>
          <AdminPage />
        </Suspense>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
