import { Icon, SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Heading, IconButton, Input, Stack, 
    useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { BsFillChatLeftFill } from 'react-icons/bs';
import { url } from '../../constants/url';
import { Chatstate } from '../../context/ChatProvider';

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { setChats, chats, setSelectedChat,user } = Chatstate();
    const [Search, setSearch] = useState("");
    const [searchedusers, setSearchedUsers] = useState([]);
    const btnRef = React.useRef();
    const toast = useToast();
    const search = async (e) => {
        e.preventDefault();
        try {
            const users = await axios.get(`${url}/api/users/allusers?search=${Search}`,{ withCredentials: true, credentials: "include" })
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

    const createchat = async (userId,pic) => {
        try {
            const { data } = await axios.post(`${url}/api/chats/`, { userId ,pic}, { withCredentials: true, credentials: "include" });
            if (!chats.chats.find((c) => {
                return c._id === data._id
            }))
                setChats({ type: "changechats", payload: [data,...chats.chats]});
            setSelectedChat({ type: "changechat", payload: data });
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


    return (
        <>
            <Button ref={btnRef} onClick={onOpen} _focus={{ outline: "none" }} _focusWithin={{ background: "none" }}
                _hover={{ background: "none" }}>
                <Icon as={BsFillChatLeftFill} />
            </Button>
            <Drawer isOpen={isOpen} placement='left' onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody p="0">
                        <Flex direction={'row'} w='100%' pt="2" alignItems={"center"}>
                            <form onSubmit={search} >
                                <Input w="82.5%" margin={1} autoComplete="none" fontSize={"sm"} value={Search}
                                    placeholder='Search using phonenumber, email' onChange={(e) => { setSearch(e.target.value) }} />
                                <IconButton _focusWithin={{ background: "none" }} _hover={{ background: "none" }}
                                    aria-label='Search database' height={"9"} icon={<SearchIcon />}
                                    _focus={{ boxShadow: "none" }} type="submit" bg="white" />
                            </form>
                        </Flex>
                        {
                            searchedusers ?
                                <Stack p={"3"}>
                                    {
                                        searchedusers.map((user) => {
                                            return (
                                                <Box bg="gray.200" width={"100%"} key={user._id} p={2} borderRadius={"10"}
                                                    _hover={{ bg: "#76E4F7" }} onClick={() => {
                                                        createchat(user._id, user.pic);
                                                        onClose();
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
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer