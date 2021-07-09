import React from 'react';

import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';

import theme from '../../styles/theme';

const ThemeContainer: React.FC = ({ children }) => {
    return (
        <ChakraProvider theme={theme} resetCSS={true} >
            <ColorModeProvider options={{ initialColorMode: "dark" }}>
                {children}
            </ColorModeProvider>
        </ChakraProvider>
    );
};

export default ThemeContainer;