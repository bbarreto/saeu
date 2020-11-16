import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./styles.css";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import LoginScreen from "./Login";
import CourseScreen from "./Course";
import CourseListScreen from "./CourseList";
import ModuleScreen from "./Module";
import ItemScreen from "./Item";


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("avaToken"));
  const toast = useToast();

  const onAuth = (username: string, password: string) => {
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/auth`,
      data: {
        username, password
      }
    }).then(response => {
      setIsLoading(false);
      localStorage.setItem("avaToken", response.data.newToken);
      setToken(response.data.newToken);
    }).catch(err => {
      toast({
        title: "Erro",
        description: err.description || "Erro ao autenticar. Tente novamente.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      console.error(err);
      setIsLoading(false);
    })
  }


  if (!token) {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <LoginScreen onAuth={onAuth} isLoading={isLoading} />
          </Route></Switch>
      </Router>
    );
  }

  return (
    <Router>
      <Switch>
        <Route path="/courses/:id/modules/:moduleId/items/:itemId">
          <ItemScreen />
        </Route>
        <Route path="/courses/:id/modules/:moduleId">
          <ModuleScreen />
        </Route>
        <Route path="/courses/:id">
          <CourseScreen />
        </Route>
        <Route path="/">
          <CourseListScreen />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
