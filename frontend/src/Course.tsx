import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Flex,
    Box,
    IconButton,
    Text,
    Stack

} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"

interface Course {
    id: number;
    name: string;
    course_code: string;
}

interface Module {
    id: number;
    name: string;
    position: number;
    unlock_at: string;
}

interface ParamsTypes {
    id: string | undefined;
}

function App() {
    const [course, setCourse] = useState<Course | undefined>();
    const [modules, setModules] = useState<Array<Module> | undefined>();
    const params = useParams<ParamsTypes>();

    useEffect(() => {
        if (!course) {
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses/${params.id}?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setCourse(response.data);
            })
        }
    }, [course, params.id]);

    useEffect(() => {
        if (!modules) {
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses/${params.id}/modules?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setModules(response.data);
            })
        }
    }, [modules, params.id]);

    return (
        <Flex flexDirection="column">
            <Box flexDirection="row" backgroundColor="red.600" padding={3} color="white" marginBottom={5}>
                <Link to={`/`}><IconButton fontSize="24px" marginRight={5} variant="ghost" colorScheme="red.800" aria-label="Sair" marginLeft="auto" icon={<MdArrowBack />} /></Link>
                <Text display="inline-block" fontWeight="bold" fontSize="xl">{course && course.name}</Text>

            </Box>

            <Box padding={5}>
                <Stack spacing="24px">
                    {modules && course && modules.sort((a, b) => (a.position > b.position) ? -1 : 1).map(module => <Box borderBottomWidth={1} borderBottomColor="gray" paddingBottom={3} key={`module-${module.id}`}>
                        <Link to={`/courses/${course.id}/modules/${module.id}`}>
                            <Text fontSize="xl" fontWeight="bold">{module.name}</Text>
                            <Text>Disponível a partir de {module.unlock_at.split("T")[0].split("-").reverse().join("/")}</Text>
                        </Link>
                    </Box>)}
                </Stack>
            </Box>
        </Flex>
    );
}

export default App;
