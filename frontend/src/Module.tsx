import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Flex,
    Box,
    IconButton,
    Icon,
    Text,
    Stack

} from "@chakra-ui/react";
import Page from "./Page";
import { Link, useParams } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { FiExternalLink } from "react-icons/fi";

interface Course {
    id: number;
    name: string;
    course_code: string;
}

interface ModuleItem {
    id: number;
    title: string;
    position: number;
    indent: number;
    type: string;
    module_id: number;
    html_url: string;
    page_url: string;
    external_url: string;
    url: string;
}

interface ParamsTypes {
    id: string | undefined;
    moduleId: string | undefined;
}

function App() {
    const [course, setCourse] = useState<Course | undefined>();
    const [modules, setModules] = useState<Array<ModuleItem> | undefined>();
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
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses/${params.id}/modules/${params.moduleId}/items?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setModules(response.data);
            })
        }
    }, [modules, params.id, params.moduleId]);

    return (
        <Flex flexDirection="column">
            <Box flexDirection="row" backgroundColor="red.600" padding={3} color="white" marginBottom={5}>
                <Link to={`/courses/${params.id}`}><IconButton fontSize="24px" marginRight={5} variant="ghost" colorScheme="red.800" aria-label="Sair" marginLeft="auto" icon={<MdArrowBack />} /></Link>
                <Text display="inline-block" fontWeight="bold" fontSize="xl">{course && course.name}</Text>

            </Box>

            <Box padding={5}>
                <Stack spacing="24px">
                    {modules && course && modules.sort((a, b) => (a.position > b.position) ? 1 : -1).slice(0, 1).map(module => <Box borderBottomWidth={1} borderBottomColor="gray" paddingBottom={3} key={`module-${module.id}`}>
                        {module.type === "ExternalUrl" &&
                            <a href={module.external_url} target="_blank" rel="noreferrer">
                                <Text fontSize="xl" fontWeight="bold">{module.title} <Icon as={FiExternalLink} /></Text>

                            </a>
                        }


                        {module.type === "Page" &&
                            <Box>
                                <Page moduleId={params.moduleId} courseId={params.id} pageId={module.page_url} />
                            </Box>
                        }

                    </Box>)}
                </Stack>
            </Box>
        </Flex>
    );
}

export default App;
