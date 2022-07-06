import React from 'react'
const { Box, SkeletonCircle, SkeletonText, Stack } = require("@chakra-ui/react");

const Skeleton = () => {
    return (
        <Stack w={"100%"} h={"100%"} overflowY="auto" bg={"gray.100"} p={"5"} pt={"2"} pb={"2"}>
            <Box display={"flex"} w={"100%"} alignItems="center" bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
            <Box display={"flex"} w={"100%"} alignItems="center"  bg={"white"} p={"1"} >
                <SkeletonCircle size='12' mr={2} />
                <Box w={"90%"}>
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                    <SkeletonText mt='2' noOfLines={1} spacing='4' />
                </Box>
            </Box>
        </Stack>
    )
}

export default Skeleton