import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Header from "./components/header";
import Movies from "./components/movies";
import MovieDetail from "./components/movieDetail";
import Error from "./components/error";
import Login from "./components/login";
import Signup from "./components/signup";
import FindFriend from "./components/findFriend";
import FriendRequests from "./components/friendRequest";
import Profile from "./components/profile";
import Followers from "./components/followers";
import Following from "./components/following";
import Footer from "./components/footer";
import FriendProfile from "./components/friendProfile";
import AdminLogin from "./components/adminLogin";
import AdminDashboard from "./components/adminDashboard";

function Layout() {
  const location = useLocation();

  // Define paths where Header & Footer should be hidden
  const hideHeaderFooterRoutes = ["/admin/login" ,"/admin/dashboard" ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-friend" element={<FindFriend />} />
        <Route path="/requests" element={<FriendRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="/friend" element={<FriendProfile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
