import { Button, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Chatstate } from '../../context/ChatProvider';
import Cookies from 'js-cookie';

const Register = () => {
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [picture ,setPicture] = useState("");
    const [picloading ,setPicloading] = useState(false);
    const [notmatch, setNotMatch] = useState(false);
    const { setUser } = Chatstate();
    const navigate = useNavigate();
    const toast = useToast();
    const register = async (e) => {
        e.preventDefault();
        if (password === confirmpassword) {
            try {
                const { data } = await axios.post("/api/users/register", {
                    name, email, password, phonenumber, picture:picture
                }, { withCredentials: true, credentials: "include" });
                setNotMatch(false)
                setPhonenumber("");
                setEmail("");
                setName("");
                setPassword("")
                setConfirmPassword("");
                setPicture("");
                navigate("/chats");
                if (data) {
                    // Cookies.set("jwtoken",data.token, { expires: 30 });
                    setUser({type:"changeuser",payload:data})
                    toast({
                        title: "User Created",
                        description: "You have signed up succesfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                }
            }
            catch (error) {
                toast({
                    title: error.response.data,
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
        else {
            setNotMatch(true)
        }
    }

    const uploadImage = (pics)=>{
        if(pics === undefined)
        {
            toast({
                title: "Some error occured",
                description: "Some error occured",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "Chat-app");
            data.append("cloud_name", "rohan-jain");
            fetch("https://api.cloudinary.com/v1_1/rohan-jain/image/upload", {
              method: "post",
              body: data,
            })
              .then((res) => res.json())
              .then((data) => {
                  setPicture(data.url.toString());
                setPicloading(false);
              })
              .catch((err) => {
                setPicloading(false);
              });
    }
}
    return (
        <form onSubmit={register} encType = "multipart/form-data">
            <Heading size={'md'}>Signup</Heading>
            <input type="text" name="name" value={name} placeholder="Enter name" onChange={(e) => { setName(e.target.value) }} required autoComplete='none' />
            <input type="text" name="phonenumber" value={phonenumber} placeholder=" Enter Phone number" required autoComplete='none' 
                minLength={5} maxLength={10} onChange={(e) => {
                    setPhonenumber(e.target.value)
                }
                } />
            <input type="email" name="email" value={email} placeholder=" Enter Email" onChange={(e) => { setEmail(e.target.value) }} required autoComplete='none' />
            <input type="password" name="password" value={password} placeholder=" Enter password"
                onChange={(e) => { setPassword(e.target.value) }} pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,20}$" title="Must contain at least one number ,one special character and one uppercase and lowercase letter, and at least 8 or more characters" required />
            <input type="password" name="confirmpassword" value={confirmpassword} placeholder=" Enter confirm password" onChange={(e) => { setConfirmPassword(e.target.value) }} required />
            {notmatch ? <span>Password not match</span> : ""}
            <input type="file"  id="myfile" onChange={(e)=>{
                setPicloading(true)
                uploadImage(e.target.files[0])
                }} name="myfile" accept='images/'/>
                <Button isLoading={picloading} type="submit" className='rgnbtn'>Submit</Button>
        </form>
    )
}

export default Register