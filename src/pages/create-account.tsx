import Router from 'next/router';

import { Grid, Flex, Link, Text } from '@chakra-ui/layout';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';


import Input from '../components/Input';
import { SignUpRequestData } from '../interfaces/auth';
import { AuthContext } from '../contexts/auth/AuthContext';

export default function Home() {
  const { register, handleSubmit } = useForm();
  const { signUp } = useContext(AuthContext)

  const handleSignUp = async (data: SignUpRequestData) => {
    try {
      await signUp(data);
      Router.push('/');
    } catch(error) {
      console.log(error);
      return;
    }
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
          {...register('email')}
          name="email"
          placeholder="E-mail"
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