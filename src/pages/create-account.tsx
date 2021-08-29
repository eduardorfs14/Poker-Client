import Router from 'next/router';

import { Grid, Flex, Link, Text } from '@chakra-ui/layout';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Heading, toast, useToast } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';


import Input from '../components/Input';
import { SignUpRequestData } from '../interfaces/auth';
import { AuthContext } from '../contexts/auth/AuthContext';

export default function Home() {
  const toast = useToast();
  const { register, handleSubmit } = useForm();
  const { signUp } = useContext(AuthContext)

  const handleSignUp = async (data: SignUpRequestData) => {
    try {
      await signUp(data);
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
          Crie sua conta.
        </Heading>

        <Input
          {...register('name')}
          name="name"
          placeholder="Nome"
          type="text"
          marginTop={2}
        />

        <Input
          {...register('email')}
          name="email"
          placeholder="E-mail"
          type="email"
          marginTop={2}
        />

        <Input
          {...register('password')}
          name="password"
          placeholder="Senha"
          type="password"
          marginTop={2}
        />

        <Button
          backgroundColor="purple.500"
          height="50px"
          borderRadius="sm"
          marginTop={6}
          onClick={handleSubmit(handleSignUp)}
          _hover={{ backgroundColor: 'purple.600' }}
          _focus={{}}
          _active={{ backgroundColor: 'purple.800' }}
        >
          CRIAR
        </Button>

        <Text
          textAlign="center"
          fontSize="sm"
          color="gray.300"
          marginTop={6}
        >
          Já tem uma conta? {" "}
          <Link
            href="/login"
            color="purple.600"
            fontWeight="bold"
            _hover={{ color: 'purple.500' }}
            _focus={{}}
          >
            Log-in
          </Link>
        </Text>
      </Flex>
    </Grid>
  )
}