import "./chatpage.css"
import React, { useEffect } from 'react'
import Mychats from '../../components/chatcomponents/Mychats'
import { Box, useToast } from "@chakra-ui/react"
import ChatBox from "../../components/chatcomponents/ChatBox"
import { Chatstate } from "../../context/ChatProvider"
import socket from "../../context/socket";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { url } from "../../constants/url"


const Chatpage = () => {

const {user,setUser} = Chatstate()
const navigate = useNavigate();
const toast = useToast()
const checkcookie = async () => {
  try
  {
      const {data} = await axios.get(`${url}/api/users/checkcookie`,{ withCredentials: true, credentials: "include" });
      if (data) {
        setUser({type:"changeuser", payload: data});
      }
      
      else navigate("/")
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

useEffect(() => { checkcookie() },[])
useEffect(() => {
  socket.emit("setup", user.user._id)
}, [user.user._id]);

  return (
    <>
    <Box w={"100vw"} h={"100vh"} display={"flex"} justifyContent={"center"} alignItems={"center"} bg={"gray.300"} overflowX={"hidden"} >
    <Box bg={"white"} w={{base:"100%",lg:"94%"}} h={{base:"100%",lg:"95%"}} display="flex">
      <Mychats></Mychats>
      <ChatBox></ChatBox>
    </Box>
    </Box>
    </>
  )
}

export default Chatpage