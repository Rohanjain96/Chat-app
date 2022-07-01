import "./homepage.css"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from "../../components/Authentication/Login";
import Register from '../../components/Authentication/Register';
import { Heading, useToast } from "@chakra-ui/react";
import Cookies from 'js-cookie'
import axios from "axios";
import { Chatstate } from "../../context/ChatProvider";

const Homepage = () => {
  const navigate = useNavigate();
 const {setUser} = Chatstate()
  const toast = useToast()
  // const checkcookie = async () => {
  //   try
  //   {
  //     const token = Cookies.get("jwtoken") 
  //     if (token!==undefined) {
  //       navigate("/chats");
  //     }
  //   }
  //   catch(error)
  //   {
  //     toast({
  //       title: error.message,
  //       description: error.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     })
  //   }
  // }
  const checkcookie = async () => {
    try
    {
        // const {data} = await axios.post("https://mern-chatify-app.herokuapp.com/api/users/checkcookie",{token} ,{ withCredentials: true, credentials: "include" });
        const {data} = await axios.post("/api/users/checkcookie" ,{ withCredentials: true, credentials: "include" });
        if (data) {
          console.log("data is",data)
          setUser({type:"changeuser", payload: data});
          navigate("/chats")
        }
    }
    catch(error)
    {
      toast({
        title: error.message,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  useEffect(() => {
    checkcookie();
  }, []);

const [setclass,setClass] = useState("container")
 const signup = () => {
	setClass("container right-panel-active")
 };
const signin= () => {
	setClass("container")
};


  return (
    <>
      <div className="wrapper">
      <div className={setclass} id="container">
        <div className="form-container sign-up-container">
          <Register />
        </div>
        <div className="form-container sign-in-container">
          <Login />
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <Heading>Welcome Back!</Heading>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={signin} id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <Heading>Hello, Friend!</Heading>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={signup}  id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Homepage