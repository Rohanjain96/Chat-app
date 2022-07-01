import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Chatstate } from '../../context/ChatProvider'
import ChatProfileDrawer from '../Drawer/ChatProfileDrawer'
import { getSenderName } from './chatLogic'
import socket from '../../context/socket'

const ChatBox = () => {
    const selectedchatcompare = useRef(null);
    const { selectedchat, user, setSelectedChat, setFetchAgain} = Chatstate();
    const [loading,setLoading] = useState(false)
    const [fetchedmessages, setFetchedMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const toast = useToast()
    const fetchmessage = async () => {
        try {
            if (selectedchat.chat === null) return;
            const { data } = await axios.get(`/api/messages/${selectedchat.chat._id}`,
                { withCredentials: true, credentials: "include" })
            setFetchedMessages(data);
            setLoading(false)
            scrolltobottom();
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

    const scrolltobottom = () => {
        if (selectedchat.chat !== null) {
            const chatbox = document.getElementById("Chatbox");
            let height = chatbox.scrollHeight
            chatbox.scrollTo({ top: height })
        }
    }
    useEffect(() => {
        setLoading(true)
        setFetchedMessages([])
        setNewMessage("");
        if (selectedchat.chat !== null)
        fetchmessage();
        selectedchatcompare.current = selectedchat;
    }
        , [selectedchat])
        
    const typinghandler = (e) => {
        setNewMessage(e.target.value)
        if (e.key === "Enter" && newMessage) {
            sendmessage()
        }
    }

    useEffect(() => {
        selectedchatcompare.current = selectedchat;
    }, [])

    const sendmessage = async (e) => {
        try {
            if(newMessage.trim().length===0) return
            setNewMessage(newMessage.trim())
            const message = { content: newMessage, chatId: selectedchat.chat._id }
            const { data } = await axios.post("/api/messages/sendmessage",
                message, { withCredentials: true, credentials: "include" })
            socket.emit("sendMessage", data)
            setNewMessage("");
            setFetchedMessages([...fetchedmessages, data])
            setFetchAgain(true)
            scrolltobottom()
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
       socket.on("recievedMessage", (message) => {
           if (selectedchatcompare.current.chat === null || selectedchatcompare.current.chat._id !== message.chat._id) { return;}
            else {
                setFetchedMessages([...fetchedmessages, message])
            }

        })
    })

    const capatilize = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return (
        <>
            {
                selectedchat.chat ?
                    <Box d={{ base: selectedchat ? "flex" : "none", md: "flex" }} flexDirection="column"
                        width={{ base: "100%", md: "60%" }} minHeight={"100%"} position={"relative"} overflow={"hidden"}
                        bg={"gray.200"} pl={{ base: 0, lg: 2 }} pb={2}>
                        <Box width={"100%"} minHeight={{base:"7vh",lg:"8vh"}} bg={"gray.100"} display="flex" alignItems={"center"} 
                            pt={2} pb={2} top="0" zIndex={"5"}>
                            <IconButton icon={<ArrowBackIcon />} h={9} p="0" d={{ base: "flex", lg: "none" }} size={"md"}
                                outline={"none"}
                                onClick={() => setSelectedChat({ type: "changechat", payload: null })} />
                            <Box display={"flex"} alignItems={"center"} ml={1} h={"100%"}>
                                <ChatProfileDrawer></ChatProfileDrawer>
                                <Text ml={1} color={"InfoText"} fontWeight={"semibold"} fontSize={"lg"}>
                                    {
                                        capatilize(selectedchat.chat.chatName === 'sender' ? user.user.name === selectedchat.chat.users[1].name ? selectedchat.chat.users[0].name : selectedchat.chat.users[1].name : selectedchat.chat.chatName)
                                    }
                                </Text>
                            </Box>
                        </Box>
                    <Box w={"100%"} height={{base:"80vh",lg:"83vh"}}  mb={1} zIndex={2}>
                        {loading?
                        <Stack display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} h={"100%"} bg="white" mb={2}>
                            <Spinner size='xl' />
                        </Stack>
                            :
                        <Stack width={"100%"} h={{base:"100%",lg:"100%"}} bg="white" mb={2} overflow={"auto"} p={6} id="Chatbox">
                            {
                                fetchedmessages !== undefined && fetchedmessages.map((message, index) => {
                                    return (
                                        <Box w={"100%"} display={"flex"} justifyContent={message.sender._id === user.user._id ? "right" : "left"}
                                            key={message._id}>
                                            <Box borderRadius={"5px"} bg={message.sender._id !== user.user._id ? "#BEE3F8" : "green.100"} maxW={"40%"} p={2}>
                                                {selectedchat.chat.isGroupChat ? <Text fontWeight={"bold"} >{(getSenderName(fetchedmessages, index, user))}</Text> : ""}
                                                <Text textAlign={"end"}
                                                    fontWeight={"normal"} mb={1}>
                                                    {message.content}
                                                </Text>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Stack>}
                        </Box>
                        <Box display={"flex"} w={"100%"} h={"5vh"} > 
                            <FormControl display={"flex"} onKeyDown={typinghandler}>
                                <Input w={{ base: "95%", lg: "100%" }}  autoComplete="disabled" fontSize={"sm"} h={"9"} placeholder=''
                                    bg="white" ml={{ base: "1", lg: "0" }} mr={{ base: "0", lg: "1"}} onChange={typinghandler} value={newMessage}  />
                            </FormControl>
                            <IconButton aria-label='Send Message' type='submit' display={{ base: "block", lg: "none" }} w={1} size={"sm"}
                                _focus={{ boxShadow: "none" }} height={"9"} icon={<ArrowForwardIcon />} outline={"none"} onClick={() => {
                                    sendmessage();
                                }} bg="white" />
                        </Box>
                    </Box>
                    : <Box d={{ base: selectedchat.id ? "flex" : "none", md: "flex" }} flexDirection="column" width={{ base: "100%", md: "60%" }} minHeight={"100%"} bg={"gray.200"} justifyContent={"center"} alignItems={"center"} p={2}>
                        <Text fontSize={{ md: "2xl", lg: "3xl" }} fontWeight={"bold"} color={"GrayText"}>Select any chat to start chating</Text>
                    </Box>
            }
        </>
    )
}

export default ChatBox