import { Outlet, useNavigate } from 'react-router'
import React, { useEffect } from 'react'
import MainNavbar from './NavBar'
import Footer from './footer'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { BASE_URL } from '../utils/constants'
import { addUser } from '../utils/userSlice'
import { useSelector } from 'react-redux'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);


const fetchUser = async () =>{
  try{
    const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });
    dispatch(addUser(res.data));
  } catch(err) {
    if(err.status === 401){
      navigate("/login");
    };
    console.error(err);
  };

};

useEffect(() =>{
  if(!userData){
    fetchUser();
  }
}, []);


  return (
    <div>
      <MainNavbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body
