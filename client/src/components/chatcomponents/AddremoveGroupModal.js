import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Flex, FormControl, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Chatstate } from '../../context/ChatProvider'

const AddremoveGroupModal = (props) => {
    var { users } = props;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Search, setSearch] = useState("");
    const [searchedusers, setSearchedUsers] = useState([]);
    const {selectedchat, setSelectedChat,user } = Chatstate();
    const [selectedUsers, setSelectedUsers] = useState([])
    const [addUsers, setAddUsers] = useState([])
    const toast = useToast();

    const setuser = ()=>{
        setSelectedUsers([...users]);
    }

    useEffect(() => {
    setuser()
    }, [selectedchat])
    
    const search = async (e) => {
        try {
            const users = await axios.get(`/api/users/allusers?search=${Search}`, { withCredentials: true, credentials: "include" })
            setSearchedUsers(users.data);
        } catch (error) {
            toast({
                title: error.response.data,
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        setSearch("");
    }

    const capatilize = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
    
    const handlegroup = (user) => {
        if (!addUsers.find((c) => {
            return c._id === user._id
        }))
        if (!selectedUsers.find((c) => {
            return c._id === user._id
        }))
        setSelectedUsers([...selectedUsers,user])
        setAddUsers([...addUsers, user])
    }
    
    const updatechat = async () => { 
            try {
                const { data } = await axios.patch("/api/chats/addToGroup", {chatId:selectedchat.chat._id, users:JSON.stringify(addUsers.map((user)=>user._id))}, { withCredentials: true, credentials: "include" });
                setSelectedChat({ type: "changechat", payload: data });
                setSearch("");
                setAddUsers([])
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
    const removeuser = async(user) => {
        try {

            const { data } = await axios.patch("/api/chats/removeFromGroup",{ chatId:selectedchat.chat._id, userId:user._id }, { withCredentials: true, credentials: "include" });
            if(data === "undefined" || data === null)
            {
                selectedUsers.splice(selectedUsers.indexOf(user), 1);
                setSelectedUsers([...selectedUsers]);
                addUsers.splice(addUsers.indexOf(user), 1);
                setAddUsers([...addUsers]);
                return;
            }
            setSelectedChat({ type: "changechat", payload: data });
            selectedUsers.splice(selectedUsers.indexOf(user), 1);
            setSelectedUsers([...selectedUsers]);
            addUsers.splice(addUsers.indexOf(user), 1);
            setAddUsers([...addUsers]);

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
            {
                user.user._id === selectedchat.chat.groupAdmin._id?
                <Button onClick={onOpen} _focus={{ boxShadow: "none" }}   mb={2}>Add or Remove Participants</Button>:""
            }
            <Modal onClose={onClose} isOpen={isOpen} isCentered size={"2xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader mb={2}>
                        <ModalCloseButton _focus={{ boxShadow: "none" }}  />
                    </ModalHeader>
                    <ModalBody display={"flex"} flexDir={"column"}>
                        {        
                            selectedUsers.length > 0 ? <Box display={"flex"} width={"100%"} mb={1} p={1}  flexWrap={"wrap"}>
                                {
                                    selectedUsers.map((user) => {
                                        return (
                                            <Box display={"flex"} key={user._id} background={"whatsapp.300"} mr={2} mb={1} p={2} borderRadius={"lg"} alignItems={"center"}>
                                                <Text color={"white"} mr={1} fontWeight={"semibold"}>{capatilize(user.name)}</Text>
                                                <IconButton icon={<SmallCloseIcon />} _focus={{ boxShadow: "none" }}  
                                                 _focusWithin={{ background: "none" }} minWidth={0} lineHeight={0} _hover={{ background: "none" }} 
                                                 size={"sm"} onClick={() => {
                                                    removeuser(user)
                                                    }} bg={"transparent"} />
                                            </Box>
                                        )
                                    })
                                }
                            </Box> : ""
                        }
                        <FormControl display={"flex"} alignItems={"center"} width={'100%'}>
                            <Input w="95%" margin={1} autoComplete="none" fontSize={"sm"} value={Search}
                                placeholder='Search using phonenumber, email' onChange={(e) => { setSearch(e.target.value) }} />
                            <IconButton _focusWithin={{ background: "none" }} _hover={{ background: "none" }} aria-label='Search database' height={"9"} icon={<SearchIcon />}
                                _focus={{ boxShadow: "none" }} onClick={() => {
                                    search()
                                }} bg="white" />
                        </FormControl>
                        {
                            searchedusers ?
                                <Stack p={"1"} mt={2}>
                                    {
                                        searchedusers.map((user) => {
                                            return (
                                                <Box bg="gray.200" width={"100%"} key={user._id} p={2} borderRadius={"10"}
                                                    _hover={{ bg: "#76E4F7" }} onClick={() => {
                                                        handlegroup(user)
                                                    }}>
                                                    {
                                                        <Flex direction={"row"} alignItems={"center"} >
                                                            <Avatar name={user.name} mr={"2.5"} src={user.pic}></Avatar>
                                                            <Flex direction={"column"} >
                                                                <Heading color='gray' fontSize={"sm"} textAlign={"left"}>
                                                                    {capatilize(user.name)}
                                                                </Heading>
                                                                <span>
                                                                    {user.phonenumber}
                                                                </span>
                                                            </Flex>
                                                        </Flex>
                                                    }
                                                </Box>)
                                        })
                                    }
                                </Stack> : ""
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button background={"twitter.300"} color={"white"} onClick=
                            {() => {
                                updatechat();
                                onClose()
                            }
                            }>Add user</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddremoveGroupModal