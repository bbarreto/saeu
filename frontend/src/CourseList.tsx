import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Flex,
    Box,
    IconButton,
    Text,
    Stack,
    Spinner
} from "@chakra-ui/react";
import { Link } from "react-router-dom"
import { MdExitToApp } from "react-icons/md"

interface Course {
    id: number;
    name: string;
    course_code: string;
}

function App() {
    const [courses, setCourses] = useState<Array<Course> | undefined>();

    useEffect(() => {
        if (!courses) {
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setCourses(response.data);
            })
        }
    }, [courses]);

    return (
        <Flex flexDirection="column">
            <Box flexDirection="row" backgroundColor="red.600" padding={3} color="white" marginBottom={5}>
                <Text display="inline-block" fontWeight="bold" fontSize="xl">SAEU</Text>
                <IconButton onClick={() => {
                    localStorage.removeItem("avaToken");
                    document.location.href = "/"
                }} variant="ghost" colorScheme="red.800" aria-label="Sair" marginLeft="auto" icon={<MdExitToApp />} />
            </Box>

            {!courses && <Box padding={30} textAlign="center"><Spinner /><Text>Carregando conteúdo...</Text></Box>}

            {courses && <Box padding={5}>
                <Text marginBottom={5}>Escolha um curso:</Text>
                <Stack spacing="24px">
                    {courses.map(course => <Box borderBottomWidth={1} borderBottomColor="gray" paddingBottom={3} key={`curso-${course.id}`}>
                        <Link to={`/courses/${course.id}`}><Text fontSize="xl" fontWeight="bold">{course.name}</Text></Link>
                    </Box>)}
                </Stack>
            </Box>}
        </Flex>
    );
}

export default App;
