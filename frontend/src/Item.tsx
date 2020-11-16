import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Flex,
    Box,
    IconButton,
    Icon,
    Text,

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
    itemId: string | undefined;
}

function App() {
    const [course, setCourse] = useState<Course | undefined>();
    const [modules, setModules] = useState<ModuleItem | undefined>();
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
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses/${params.id}/modules/${params.moduleId}/items/${params.itemId}?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setModules(response.data);
            })
        }
    }, [modules, params]);

    return (
        <Flex flexDirection="column">
            <Box flexDirection="row" backgroundColor="red.600" padding={3} color="white" marginBottom={5}>
                <Link to={`/courses/${params.id}/modules/${params.moduleId}`}><IconButton fontSize="24px" marginRight={5} variant="ghost" colorScheme="red.800" aria-label="Sair" marginLeft="auto" icon={<MdArrowBack />} /></Link>
                <Text display="inline-block" fontWeight="bold" fontSize="xl">{course && course.name}</Text>

            </Box>

            <Box padding={5}>
                {modules && modules.type === "Page" && <Page courseId={params.id} moduleId={params.moduleId} pageId={modules.page_url} />}
                {modules && modules.type !== "Page" && <a href={modules.external_url || modules.html_url}>{modules.title} <Icon as={FiExternalLink} /></a>}
            </Box>
        </Flex>
    );
}

export default App;
