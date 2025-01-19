import "./homepage.css"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from "../../components/Authentication/Login";
import Register from '../../components/Authentication/Register';
import { Box, Center, Heading, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { Chatstate } from "../../context/ChatProvider";
import { url } from "../../constants/url";

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = Chatstate()
  const toast = useToast()
  const [loading,setLoading] = useState(true);

  const checkcookie = async () => {
    try {
      let { data } = await axios.get(`${url}/api/users/checkcookie`, { withCredentials: true, credentials: "include" });

      console.log(data)
      if (data) {
        setLoading(false)
        navigate("/chats")
        data = null;
      }
      setLoading(false)
    }
    catch (error) {
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

  const [setclass, setClass] = useState("container")
  const signup = () => {
    setClass("container right-panel-active")
  };
  const signin = () => {
    setClass("container")
  };


  return (
    <>
    {
      loading?
      <Center h={"100vh"}>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} h={"100%"}>
        <Spinner size='xl'  />
      </Box>
      </Center>
      :user.user?
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
                <button className="ghost" onClick={signup} id="signUp">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>:null
      }
    </>
  )
}

export default Homepage