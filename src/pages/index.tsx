import { Grid } from "@chakra-ui/layout";

import Navbar from "../components/Navbar";
import PokerTableCard from '../components/PokerTableCard';
import { Button } from '@chakra-ui/button';
import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from "../utils/supabaseClient";

type TableType = {
  id: string;
  name: string;
  bigBlind: number;
  minPlayers: number;
  maxPlayers: number;
  houseSlice: number;
  active: boolean;
}

const Home: React.FC = () => {
  const [tables, setTables] = useState<TableType[] | null>([]);

  useEffect(() => {
    const unsubscribe = supabase
    .from('poker_tables')
    .select()
    .then(res => {
      setTables(res.data);
    });
    
    return () => {
      unsubscribe
    }
  }, []);

  return (
    <>
      <Navbar marginBottom={0} height="70px" />
      <Grid
        as="main"
        height="calc(100vh - 70px)"
        templateColumns="1fr 320px 320px 320px 1fr"
        templateRows="1fr 480px 60px 1fr"
        templateAreas="
          '. . . . .'
          '. table-stats-1 table-stats-2 table-stats-3 .'
          '. previous-button . next-button .'
          '. . . . .'
        "
      >
        <Button
          gridArea="previous-button"
          color="white"
          backgroundColor="purple.500"
          borderRadius="lg"
          _hover={{ backgroundColor: "purple.600" }}
          _focus={{}}
          marginLeft={4}
          marginTop={10}
         >
          Anterior
        </Button>

        <Button
          gridArea="next-button"
          color="white"
          backgroundColor="purple.500"
          borderRadius="lg"
          _hover={{ backgroundColor: "purple.600" }}
          _focus={{}}
          marginLeft={4}
          marginTop={10}
         >
          Próximo
        </Button>

        {
          tables?.map((table, index) => {
            return (
              <PokerTableCard 
                key={table.id}
                id={table.id}
                name={table.name}
                bigBlind={table.bigBlind}
                minPlayers={table.maxPlayers}
                maxPlayers={table.maxPlayers}
                gridArea={`table-stats-${index + 1}`}
              />
            )
          })
        }
      </Grid>
    </>
  );
};

export default Home;