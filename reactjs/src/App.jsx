import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route } from "react-router-dom"

import Header from "./components/header"; 
import Movies from "./components/movies"
import MovieDetail from "./components/movieDetail"
import Error from "./components/error"
import Login from './components/login'
import Signup from './components/signup'
import FindFriend from './components/findFriend'
import FriendRequests from './components/friendRequest'
import Profile from './components/profile'
import Followers from './components/followers'
import Footer from './components/footer'
function App() {

  return (
    <>
      
      <BrowserRouter>
        <Header /> {/* Header appears on all pages */}
        <Routes>
          <Route path='/' element={<Movies />}></Route>
          <Route path="movie/:id" element={<MovieDetail />}></Route>
          <Route path='/login' element={< Login/>}></Route>
          <Route path='/signup' element={< Signup/>}></Route>
          <Route path='/find-friend' element={< FindFriend/>}></Route>
          <Route path='/requests' element={< FriendRequests/>}></Route>
          <Route path='/profile' element={< Profile/>}></Route>
          <Route path='/followers' element={< Followers/>}></Route>
          <Route path='*' element={< Error/>}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
