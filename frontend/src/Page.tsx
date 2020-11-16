import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Flex,
} from "@chakra-ui/react";
import renderHTML from 'react-render-html';

interface PageItem {
    created_at: string;
    url: string;
    title: string;
    body: string;
    front_page: boolean;
}

interface Params {
    courseId: string | undefined;
    moduleId: string | undefined;
    pageId: string | undefined;
}

function App({ courseId, moduleId, pageId }: Params) {
    const [page, setPage] = useState<PageItem | undefined>();

    useEffect(() => {
        if (!page) {
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API_URL}/api/v1/courses/${courseId}/pages/${pageId}?access_token=${localStorage.getItem("avaToken")}`
            }).then(response => {
                setPage(response.data);
            })
        }
    }, [page, courseId, pageId]);


    return (
        <Flex flexDirection="column">
            {page && renderHTML(page?.body.replace(/https:\/\/cursos.univesp.br\/courses/g, "/courses").replace(/modules\/items/g, `modules/${moduleId}/items`).replace(/_blank/g, "_self") ?? "")}
        </Flex>
    );
}

export default App;
