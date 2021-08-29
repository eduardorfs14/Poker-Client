import Router from 'next/router';

import { Grid, Flex, Link, Text, Heading } from '@chakra-ui/layout'
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';

import Input from '../components/Input';
import { AuthContext } from '../contexts/auth/AuthContext';
import { SignInRequestData } from '../interfaces/auth';
import { useToast } from '@chakra-ui/react';

export default function Login() {
  const toast = useToast();
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext)

  const handleSignIn = async (data: SignInRequestData) => {
    try {
      await signIn(data);
      Router.push('/');
    } catch(error) {
      addToast(error.message, 'error');
      return;
    }
  }

  function addToast(
    description: string, 
    status: "info" | "warning" | "success" | "error" | undefined = 'success', 
    title?: string
  ) {
      toast({
          title,
          description,
          status,
          duration: 3000,
          isClosable: true,
          position: "top-right"
      })
  }

  return (
    <Grid
      as="main"
      height="100vh"
      templateColumns="1fr 480px 1fr"
      templateRows="1fr 480px 1fr"
      templateAreas="
        '. . .'
        '. form .'
        '. . .'
      "
      justifyContent="center"
      alignItems="center"
    >
      <Flex 
        gridArea="form"
        height="100%"
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        justifyContent="center"
        padding={16}
      >
        <Heading
          color="purple.500"
          alignSelf="center"
          justifyContent="center"
          height="50px"
          marginBottom="20px"
        >
          Entre com sua conta.
        </Heading>

        <Input
          {...register('email')}
          name="email"
          placeholder="E-mail"
        />

        <Input
          {...register('password')}
          name="password"
          type="password"
          placeholder="Senha"
          marginTop={2}
        />

        <Button
          backgroundColor="purple.500"
          height="50px"
          borderRadius="sm"
          marginTop={6}
          onClick={handleSubmit(handleSignIn)}
          _hover={{ backgroundColor: 'purple.600' }}
          _focus={{}}
          _active={{ backgroundColor: 'purple.800' }}
        >
          ENTRAR
        </Button>

        <Text
          textAlign="center"
          fontSize="sm"
          color="gray.300"
          marginTop={6}
        >
          Não tem uma conta? {" "}
          <Link
            href="/create-account"
            color="purple.600"
            fontWeight="bold"
            _hover={{ color: 'purple.500' }}
            _focus={{}}
          >
            Registre-se
          </Link>
        </Text>
      </Flex>
    </Grid>
  )
}