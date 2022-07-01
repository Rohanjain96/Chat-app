import { Avatar, Box, Button, IconButton, Text, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useRef } from 'react'
import { Chatstate } from '../../context/ChatProvider';
import { Slide } from '@chakra-ui/react'
import './profiledrawer.css'
import { ArrowBackIcon } from '@chakra-ui/icons';

const ProfileDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = Chatstate();
    const btnRef = useRef();
    return (
        <>
            <Button ref={btnRef} onClick={onOpen} _focus={{ outline: "none" ,background:"none" }} _focusWithin = {{background:"none"}} _hover={{background:"none"}}>
                <Wrap>
                    <WrapItem>
                        <Avatar size={"md"} ml={2} name={user.user.name} src={user.user.pic} />
                    </WrapItem>
                </Wrap>
            </Button>
            <Slide direction='right' in={isOpen} style={{ zIndex: 10 }} top="0px" >
                <Box w={"100%"} h={"100%"} zIndex={"1000"} bg="gray.100">
                    <Box w={"100%"} display={"flex"} alignItems={"center"} mb={9} ml={4}>
                        <IconButton icon={<ArrowBackIcon />} onClick={onClose} size={"lg"} mr={3} cursor={"pointer"} _hover={{background:"none"}} _focusWithin = {{background:"none"}} _focus={{ boxShadow: "none" }} />
                        <Text color={"white"} fontWeight={"bold"} fontSize={"3xl"}>Profile</Text>
                    </Box>
                    <Wrap mb={7}>
                        <WrapItem display={"flex"} justifyContent="center" w={"100%"}>
                            <Avatar h={"44"} w={"44"} name={user.user.name} src={user.user.pic} />
                        </WrapItem>
                    </Wrap>
                    <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"} mb={6}>
                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Name</Text>
                    <Text fontSize={"xl"}>{user.user.name}</Text>
                    </Box>
                    <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"} mb={6}>
                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Phone Number</Text>
                    <Text fontSize={"xl"}>{user.user.phonenumber}</Text>
                    </Box>
                    <Box p={8} display={"flex"} flexDirection={"column"} justifyContent={"center"} w={"100%"} bg={"white"} h={"20"}>
                    <Text color={"whatsapp.500"} fontSize={"lg"} mb={2}>Email</Text>
                    <Text fontSize={"xl"}>{user.user.email} </Text>
                    </Box>

                </Box>
            </Slide>
        </>
    )
}

export default ProfileDrawer