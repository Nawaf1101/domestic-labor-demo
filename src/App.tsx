import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { OfficeDashboardPage } from "./pages/OfficeDashboardPage";
import { OfficesListPage } from "./pages/OfficesListPage";
import { OfficeWorkersPage } from "./pages/OfficeWorkersPage";
import { WorkerDetailsPage } from "./pages/WorkerDetailsPage";
import { MyReservationsPage } from "./pages/MyReservationsPage";
import theme from "./theme";
import "./i18n";

const AppContent = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          currentUser ? (
            currentUser.role === "office" ? (
              <Navigate to="/office/dashboard" replace />
            ) : (
              <Navigate to="/customer/offices" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/office/dashboard"
        element={
          <ProtectedRoute requiredRole="office">
            <OfficeDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/offices"
        element={
          <ProtectedRoute requiredRole="customer">
            <OfficesListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/office/:officeId"
        element={
          <ProtectedRoute requiredRole="customer">
            <OfficeWorkersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/worker/:workerId"
        element={
          <ProtectedRoute requiredRole="customer">
            <WorkerDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/reservations"
        element={
          <ProtectedRoute requiredRole="customer">
            <MyReservationsPage />
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return <AppContent />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Box minH="100vh" w="100vw" overflowX="hidden">
            <AppRoutes />
          </Box>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
