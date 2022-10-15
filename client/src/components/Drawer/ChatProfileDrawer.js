import { Avatar, Box, Button, IconButton, Input, Text, useDisclosure, useToast, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Chatstate } from '../../context/ChatProvider';
import { Slide } from '@chakra-ui/react'
import './profiledrawer.css'
import { ArrowBackIcon, CheckIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';
import AddremoveGroupModal from '../chatcomponents/AddremoveGroupModal';
const capatilize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

const ChatProfileDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedchat, user, setSelectedChat,setFetchAgain } = Chatstate();
    const [editbutton, setEditButton] = useState(false);
    const [newGroupname, setNewGroupName] = useState("");
    const btnRef = React.useRef();
    const toast = useToast()
    const handleGroupname = async () => {
        try {
            const { data } = await axios.patch("/api/chats/renamegroup", { chatId: selectedchat.chat._id, chatName: newGroupname }, { withCredentials: true, credentials: "include" });
            setEditButton(false);
            setNewGroupName("");
            setSelectedChat({ type: "changechat", payload: {...data} });
        } catch (error) {
            toast({
                title: error.message,
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        setEditButton(false);
        setFetchAgain(true)
    }

    const leaveGroup = async () => {
        try {
            const { data } = await axios.patch("/api/chats/leaveGroup", { chatId: selectedchat.chat._id, userId: user._id }, { withCredentials: true, credentials: "include" });
            if (data) {
                setFetchAgain(true)
                setSelectedChat({ type: "changechat", payload: null })
            }
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
    return (
        <>
            <Button ref={btnRef} onClick={onOpen} _focus={{ outline: "none", background: "none" }} _focusWithin={{ background: "none" }} _hover={{ background: "none" }}>
                <Wrap >
                    <WrapItem>
                        <Avatar size={"md"} name={selectedchat.chat.name} src={selectedchat.chat.pic} />
                    </WrapItem>
                </Wrap>
            </Button>
            <Slide direction='right' in={isOpen} style={{ zIndex: 10 }} position={"absolute"} top="0px" >
                <Box w={"100%"} h={"100vh"} zIndex={"1000"} bg="gray.200" overflowY={"auto"} overflowX={'hidden'}>
                    <Box w={"100%"} display={"flex"} alignItems={"center"} mb={6} ml={4}>
                        <IconButton icon={<ArrowBackIcon />} onClick={onClose} size={"lg"} mr={3} background="transparent" cursor={"pointer"} _hover={{ background: "none" }} _focusWithin={{ background: "none" }} _focus={{ boxShadow: "none" }} />
                        <Text fontWeight={"bold"} color={"white"} fontSize={"3xl"}>Profile</Text>
                    </Box>
                    <Wrap mb={7}>
                        <WrapItem display={"flex"} justifyContent="center" w={"100%"}>
                            <Avatar h={"44"} w={"44"} name={selectedchat.chat.name} src={selectedchat.chat.pic} />
                        </WrapItem>
                    </Wrap>
                    {
                        selectedchat.chat.isGroupChat === false ?
                            <Box>
                                <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"} mb={4}>
                                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Name</Text>
                                    <Text fontSize={"xl"}> {capatilize(selectedchat.chat.users[0]._id === user.user._id?selectedchat.chat.users[1].name : selectedchat.chat.users[0].name)}</Text>
                                </Box>
                                <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"} mb={6}>
                                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Phone Number</Text>
                                    <Text fontSize={"xl"}>{selectedchat.chat.users[0]._id === user.user._id?selectedchat.chat.users[1].phonenumber : selectedchat.chat.users[0].phonenumber}</Text>
                                </Box>
                                <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"}>
                                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Email</Text>
                                    <Text fontSize={"xl"}>{selectedchat.chat.users[0]._id === user.user._id?selectedchat.chat.users[1].email : selectedchat.chat.users[0].email} </Text>
                                </Box>
                            </Box>
                            :
                            <Box overflowY={"auto"}>
                                <Box p={6} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} w={"100%"} bg={"white"} h={"20"} mb={4}>
                                    {
                                        editbutton ?
                                            <Box display={"flex"} flexDirection={"column"} width={"95%"}>
                                                <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Name</Text>
                                                <Input w="95%" mr={1} autoComplete="none" fontSize={"sm"} value={newGroupname} borderRadius={0} p={0} border={"none"} _focus={{ ouline: "none", borderBottom: " 2px solid green" }} _hover={{ borderBottom: "2px solid green" }} _focusWithin={{ outline: "none" }} borderBottom={" 2px solid green"}
                                                    placeholder="Enter new Group Name" onChange={(e) => { setNewGroupName(e.target.value) }} />
                                            </Box>
                                            :
                                            <Box display={"flex"} flexDirection={"column"}>
                                                <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Name</Text>
                                                <Text fontSize={"xl"}> {capatilize(selectedchat.chat.chatName)}</Text>
                                            </Box>
                                    }
                                    {
                                        editbutton ?
                                            <IconButton cursor={"pointer"} _hover={{ background: "none" }} background={"transparent"}
                                                _focusWithin={{ background: "none" }} _focus={{ boxShadow: "none" }}
                                                icon={<CheckIcon />} onClick={() => {
                                                    if(newGroupname.trim().length>0)
                                                    {
                                                        handleGroupname()
                                                        setNewGroupName("")
                                                        setEditButton(false)
                                                    }
                                                    else
                                                    {
                                                        setEditButton(false) 
                                                    }
                                                }
                                                }></IconButton> :
                                            <IconButton cursor={"pointer"} _hover={{ background: "none" }} background={"transparent"}
                                                _focusWithin={{ background: "none" }} _focus={{ boxShadow: "none" }}
                                                icon={<EditIcon />} onClick={() => setEditButton(true)}></IconButton>
                                    }
                                </Box>
                                <Box background={"white"} width={"100%"}>
                                    <Text mb={2} p={4} pb={2} color={"whatsapp.300"} fontSize={"2xl"}>Participants</Text>
                                    {
                                        selectedchat.chat.users.map((user) => {
                                            return (
                                                <Box p={4} display={"flex"} flexDirection={"row"} alignItems={"center"} w={"100%"} h={"16"} mb={1} key={user._id}>
                                                    <Wrap mr={2}>
                                                        <WrapItem display={"flex"} justifyContent="center" w={"100%"}>
                                                            <Avatar size={"md"} name={user.name} src={user.pic} />
                                                        </WrapItem>
                                                    </Wrap>
                                                    <Box display={"flex"} flexDirection={"column"}>
                                                        <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>{capatilize(user.name)}</Text>
                                                        <Text fontSize={"xl"}> {user.phonenumber}</Text>
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>

                            </Box>
                    }

                    {selectedchat.chat.isGroupChat === true ?
                        <Box p={2} background={"white"} display={"flex"} flexDirection={"column"} width={"100%"} mt={2} mb={10}>
                            <AddremoveGroupModal users={selectedchat.chat.users}></AddremoveGroupModal>
                            <Button onClick={() => leaveGroup()} >Leave Group</Button>
                        </Box>
                        : ""
                    }
                </Box>
            </Slide>
        </>
    )
}

export default ChatProfileDrawer