import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";

import Home from "../pages/Home";
import ListingDetails from "../pages/ListingDetails";
import Register from "../pages/Register";
import Login from "../pages/Login";
import MyBookings from "../pages/MyBookings";
import CreateListing from "../pages/CreateListing";
import MyListings from "../pages/MyListings";
import EditListing from "../pages/EditListing";
import Admin from "../pages/Admin";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/listings/:listingId" element={<ListingDetails />} />

        {/* =========================
            AUTHENTICATED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>
          <Route path="/listings/create" element={<CreateListing />} />

          <Route path="/my-listings" element={<MyListings />} />

          <Route path="/listings/:listingId/edit" element={<EditListing />} />

          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
