import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Heading, useToast } from '@chakra-ui/react'
import { Chatstate } from '../../context/ChatProvider';
import "../../pages/homepage/homepage.css"
// login page
const Login = () => {
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = Chatstate()
    const toast = useToast();
    const navigate = useNavigate();
    const login = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/users/login", {
                phonenumber, password
            }, { withCredentials: true, credentials: "include" });
            setPhonenumber("");
            setPassword("");
            if (data) {
                // Cookies.set("jwtoken",data.token, { expires: 30 });
                toast({
                    title: "Login successfully",
                    description: "You have logged in succesfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
                setUser({type:"changeuser",payload:data});
            }
            navigate("/chats");
        } catch (error) {
            toast({
                title: "Invalid credentials",
                description: "Invalid credentials",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }
    return (
        <form onSubmit={login}>
            <Heading size={"md"} marginBottom={3}>Signin</Heading>
            <input type="text" htmlFor="phonenumber" value={phonenumber} placeholder="Enter phone number" onChange={(e) => { setPhonenumber(e.target.value) }} required autoComplete='none' minLength={5} maxLength={10} />
            <input type="password" htmlFor="password:" value={password} placeholder=" Enter password" onChange={(e) => { setPassword(e.target.value) }} required autoComplete='none' />
            <button type="submit" className='lgnbtn'>Submit</button>
        </form>
    )
}

export default Login