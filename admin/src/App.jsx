import { Routes, Route, Navigate } from "react-router"

import DashboardLayout from "./layouts/DashboardLayout"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import OrdersPage from "./pages/OrdersPage"
import CustomersPage from "./pages/CustomersPage"
import InterestsPage from "./pages/InterestsPage"

import PageLoader from "./components/PageLoader"

import { useAuth } from "@clerk/clerk-react"

function App() {

  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <PageLoader />
  };

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />} />
      <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}>
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="interests" element={<InterestsPage />} />
      </Route>

    </Routes>
  )
}

export default App
