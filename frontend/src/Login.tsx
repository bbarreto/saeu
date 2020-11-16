import React, { useState } from 'react';
import {
    Flex,
    Box,
    Button,
    Text,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
} from "@chakra-ui/react";

interface Params {
    onAuth: Function;
    isLoading: boolean;
}

function App({ onAuth, isLoading }: Params) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            onAuth(username, password);
        }}>
            <Flex flexDirection="column">
                <Box backgroundColor="black" padding={4} color="white" marginBottom={5}>
                    <Text fontWeight="bold" fontSize="5xl">SAEU</Text>
                    <Text marginTop={-3}>
                        Sistema de Acompanhamento
                        Estudantil Univesp
                    </Text>
                </Box>
                <Flex paddingX={10} paddingY={3} flexDirection="column" height="100%" textAlign="center">
                    <Text fontWeight="bold" fontSize="xl">Bem-vindo!</Text>
                    <Text>
                        Para acessar sua área de estudos da UNIVESP, digite seu RA e senha:
                    </Text>
                </Flex>
                <Box padding={5}>
                    <FormControl>
                        <FormLabel htmlFor="ra">Registro de Aluno (RA)</FormLabel>
                        <Input onChange={e => setUsername(e.target.value)} value={username} type="tel" id="ra" name="ra" aria-describedby="ra-helper-text" />
                        <FormHelperText id="ra-helper-text">
                            Digite seu RA. Somente números.
                        </FormHelperText>
                    </FormControl>

                    <FormControl marginTop={3}>
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <Input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password" aria-describedby="password-helper-text" />
                        <FormHelperText id="password-helper-text">
                            Digite sua senha de acesso
                        </FormHelperText>
                    </FormControl>

                    <Button type="submit" isLoading={isLoading} isFullWidth variant="solid" colorScheme="red" marginTop={3}>Entrar</Button>
                    {isLoading && <Text fontSize="xs" marginTop={5} textAlign="center">Seja paciente, o primeiro acesso pode levar até 45 segundos para acontecer.</Text>}
                </Box>
            </Flex>
        </form>
    );
}

export default App;
