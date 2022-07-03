import { Avatar, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text, useToast, Wrap, WrapItem } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Chatstate } from '../../context/ChatProvider.js';
import { BsThreeDotsVertical } from 'react-icons/bs'
import SideDrawer from '../chatcomponents/SideDrawer'
import ProfileDrawer from '../Drawer/ProfileDrawer.js';
import { useNavigate } from 'react-router-dom';
import GroupModal from './GroupModal.js';
import socket from '../../context/socket.js';
import Skeleton from './Skeleton.js';

const Mychats = () => {

  const { chats, setChats, selectedchat, setSelectedChat, user,fetchagain, setFetchAgain } = Chatstate()
  const toast = useToast();
  const navigate = useNavigate();
  const [Chatloading,setChatLoading] = useState(true)
  const fetchchats = async () => {
    // const User = user.user
    try {
      const { data } = await axios.post("/api/chats/fetchchats",{ withCredentials: true, credentials: "include" });
      if (data) {
        setChats({ type: "changechats", payload: [...data] });
      }
      setFetchAgain(false)
      setChatLoading(false)
    } catch (error) {
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
    fetchchats();
  }, [fetchagain]);

  const clearCookie = () => {
    try {
      const { data } =  axios.get("/api/chats/removecookie",{ withCredentials: true, credentials: "include" });
      navigate("/", { replace: true });
    } catch (error) {
      toast({
        title: error.message,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const capatilize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }



  useEffect(() => {
    socket.off("recievedMessage").on("recievedMessage", (message) => {
      if(chats.chats.find((chat)=> chat._id === message.chat._id) !== undefined){
        chats.chats.find((chat)=> chat._id === message.chat._id).latestMessage = message;
        if(selectedchat.chat===null||selectedchat.chat._id !== message.chat._id)
        chats.chats.find((chat) => { return chat._id === message.chat._id }).notificationcount += 1
        setChats({ type: "changechats", payload: chats.chats })
      }
    })
  })


  return (
    <>
      <Box position={"relative"} w={{ base: "100%", md: "40%" }} d={{ base: selectedchat.chat === null ? "flex" : "none", md: "flex" }} flexDirection="column" 
      h={"100%"} overflowX={"hidden"}>
        <Box w={"100%"} h={{base:"8%",lg:"9%"}} bg="gray.100" mb={1} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <ProfileDrawer></ProfileDrawer>
          <Text fontWeight={"medium"} fontSize={"2xl"}>CHATIFY</Text>
          <Box mr={3}>
            <SideDrawer></SideDrawer>
            <Menu>
              <MenuButton _focusWithin={{ background: "none" }} _hover={{ background: "none" }} _focus={{ boxShadow: "none" }} as={IconButton} icon={<BsThreeDotsVertical />} />
              <MenuList>
                <GroupModal></GroupModal>
                <MenuItem onClick={() => clearCookie()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>

        {
        Chatloading?<Skeleton></Skeleton>:  
        <Stack w={"100%"} h={"100%"} overflowY={"auto"} bg={"gray.100"} p={3} pb={{base:10,lg:3}} >
          {
            chats.chats.map((chat) => {
              return (
                <Box key={chat._id} onClick={() => {
                  setSelectedChat({ type: "changechat", payload: chat })
                  chat.notificationcount = 0;
                  setChats({ type: "changechats", payload: chats.chats })
                  socket.emit("joinchat", chat._id)
                }}
                  bg={selectedchat.chat === chat ? "cyan.300" : "white"} mt={2} p={1}
                  borderRadius={8} display={"flex"} flexDirection="row" alignItems={"center"} _hover={{ backgroundColor: "cyan.300" }}
                  color={selectedchat === chat ? "white" : "black"}>
                  <Wrap >
                    <WrapItem>
                      <Avatar size={"md"} ml={2} name={chat.name} src={chat.pic} />
                    </WrapItem>
                  </Wrap>
                  <Box display={"flex"} flexDirection="column" ml={2} justifyContent={"center"} w={"80%"} >
                    <Text fontWeight={"normal"}>{chat.chatName === "sender" ? capatilize(user.user.name === chat.users[1].name ?
                      chat.users[0].name : chat.users[1].name) : capatilize(chat.chatName)}</Text>
                    {
                      chat.latestMessage !== undefined ? <Text fontWeight={"normal"} noOfLines={1}> <strong>{
                        chat.latestMessage.sender.name !== user.user.name ? chat.latestMessage.sender.name : "you"}: </strong>
                        {chat.latestMessage.content}
                      </Text>
                        : <Text h={3}> </Text>
                    }
                  </Box>
                  {chat.notificationcount>0?<Text color={"white"} background={"whatsapp.300"} borderRadius={"50%"} w={"15px"} textAlign={"center"} >{chat.notificationcount}</Text>:""}
                </Box>)
            })
          }
        </Stack>
        }

      </Box>
    </>
  )
}

export default Mychats