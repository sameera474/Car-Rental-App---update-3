import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "../components/Navbar";
import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import FeaturedCars from "../pages/public/FeaturedCars";
import PopularCars from "../pages/public/PopularCars";
import AllReviews from "../pages/public/AllReviews";
import CarList from "../pages/user/CarList";
import CarDetails from "../pages/user/CarDetails";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import MyRentals from "../pages/user/MyRentals";
import ReviewCar from "../pages/user/ReviewCar";
import UserProfile from "../pages/user/Profile";
import ReviewForm from "../components/ReviewForm";

// Manager Pages
import ManagerDashboard from "../pages/manager/Dashboard";
import ManageCars from "../pages/manager/ManageCars";
import RentalRequests from "../pages/manager/RentalRequests";
import ReturnedCars from "../pages/manager/ReturnedCars";
import ManageUsers from "../pages/manager/ManageUsers";
import ManagerProfile from "../pages/manager/Profile";
import Statistics from "../pages/manager/Statistics";

// Boss Pages
import BossDashboard from "../pages/boss/Dashboard";
import ManageManagers from "../pages/boss/ManageManagers";
import FinancialReport from "../pages/boss/FinancialReport";
import BossProfile from "../pages/boss/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import ManageBosses from "../pages/admin/ManageBosses";
import ResetSystem from "../pages/admin/ResetSystem";
import AdminProfile from "../pages/admin/Profile";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <BrowserRouter>
    <NavBar />
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All cars */}
        <Route path="/cars" element={<CarList />} />

        {/* Category‑filtered cars */}
        <Route path="/cars/category/:category" element={<CarList />} />

        {/* Featured & Popular */}
        <Route path="/cars/featured" element={<FeaturedCars />} />
        <Route path="/cars/popular" element={<PopularCars />} />

        {/* Reviews */}
        <Route path="/reviews" element={<AllReviews />} />

        {/* Single car details */}
        <Route path="/cars/:id" element={<CarDetails />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/cars" element={<CarList />} />
          <Route path="/user/cars/:id" element={<CarDetails />} />
          <Route path="/user/myrentals" element={<MyRentals />} />
          <Route path="/user/reviews" element={<ReviewCar />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/review/:carId" element={<ReviewForm />} />
        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/manage-cars" element={<ManageCars />} />
          <Route path="/manager/rental-requests" element={<RentalRequests />} />
          <Route path="/manager/returned-cars" element={<ReturnedCars />} />
          <Route path="/manager/manage-users" element={<ManageUsers />} />
          <Route path="/manager/profile" element={<ManagerProfile />} />
          <Route path="/manager/statistics" element={<Statistics />} />
        </Route>

        {/* Boss Routes */}
        <Route element={<ProtectedRoute allowedRoles={["boss"]} />}>
          <Route path="/boss/dashboard" element={<BossDashboard />} />
          <Route path="/boss/manage-managers" element={<ManageManagers />} />
          <Route path="/boss/financial-report" element={<FinancialReport />} />
          <Route path="/boss/profile" element={<BossProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-bosses" element={<ManageBosses />} />
          <Route path="/admin/reset-system" element={<ResetSystem />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
