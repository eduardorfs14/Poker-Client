import { Grid, Flex, Link, Text } from '@chakra-ui/layout';
import { Heading, Stack, Radio, RadioGroup } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';

import Input from '../../components/Input';
import Navbar from '../../components/Navbar';
import { useState } from 'react';
import { FormEvent } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { supabase } from '../../utils/supabaseClient';

export default function Home() {
  const [name, setName] = useState('');
  const [bigBlind, setBigBlind] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [active, setActive] = useState<boolean>();

  const { user } = useContext(AuthContext);

  async function handleCreateTable(event: FormEvent) {
    event.preventDefault();

    if (name.trim() === '' || bigBlind.trim() === '' || minPlayers.trim() === '' || maxPlayers.trim() === '') {
      return;
    };

    if (!user) {
      throw new Error('Você deve estar logado para criar uma mesa');
    };

    if (parseInt(minPlayers) < 2) {
      // Caso o mínimo de jogadores seja menor que 2

      throw new Error('Mínimo de jogadores deve ser maior ou igual a 2');
    } else if (parseInt(bigBlind) <= 0) {
      // Caso o Big blind seja menor ou igual a zero

      throw new Error('Big blind precisa ser maior que 0');
    } else if (parseInt(maxPlayers) > 9) {
      // Caso máximo de jogadores seja maior que 9

      throw new Error('Máximo de jogadores deve ser menor ou igual a 9');
    }

    await supabase
      .from('poker_tables')
      .insert([
        {
          name,
          bigBlind,
          minPlayers,
          maxPlayers,
          active
        }
      ]);

    // Snack bar show that table was created...
  }

  return (
    <>
      <Navbar />
      <Grid
        as="main"
        height="calc(100vh - 70px - 24px)"
        templateColumns="1fr 480px 1fr"
        templateRows="1fr 600px 1fr"
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
          <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleCreateTable}>
            <Heading
              color="purple.500"
              alignSelf="center"
              justifyContent="center"
              height="50px"
              marginBottom="20px"
            >
              Crie uma mesa.
            </Heading>

            <Input
              name="name"
              placeholder="Nome"
              type="text"
              onChange={event => setName(event.target.value)}
              value={name}
            />

            <Input
              name="bigBlind"
              placeholder="Big blind"
              type="number"
              marginTop={2}
              onChange={event => setBigBlind(event.target.value)}
              value={bigBlind}
            />

            <Input
              name="minPlayers"
              placeholder="Mínimo de jogadores"
              type="number"
              min={2}
              marginTop={2}
              onChange={event => setMinPlayers(event.target.value)}
              value={minPlayers}
            />

            <Input
              name="maxPlayers"
              placeholder="Máximo de jogadores"
              type="number"
              max={9}
              marginTop={2}
              onChange={event => setMaxPlayers(event.target.value)}
              value={maxPlayers}
            />

            <RadioGroup alignSelf="center" marginTop={4} onChange={event => event === 'active' ? setActive(true) : setActive(false)}>
              <Stack spacing={4} direction="row">
                <Radio colorScheme="green" value="active">
                  Ativa
                </Radio>
                <Radio colorScheme="red" value="desabled">
                  Desabilitada
                </Radio>
              </Stack>
            </RadioGroup>

            <Button
              type="submit"
              backgroundColor="purple.500"
              height="50px"
              borderRadius="sm"
              marginTop={6}
              _hover={{ backgroundColor: 'purple.600' }}
              _focus={{}}
              _active={{ backgroundColor: 'purple.800' }}
            >
              CRIAR
            </Button>
          </form>

          <Text
            textAlign="center"
            fontSize="sm"
            color="gray.300"
            marginTop={8}
          >
            <Link
              href="/"
              color="purple.600"
              fontWeight="bold"
              fontSize="24px"
              _hover={{ color: 'purple.500' }}
              _focus={{}}
            >
              Voltar
            </Link>
          </Text>
        </Flex>
      </Grid>
    </>
  )
}
