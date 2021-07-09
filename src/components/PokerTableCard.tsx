import { Button } from "@chakra-ui/button"
import { Flex, FlexProps, Heading } from "@chakra-ui/layout"
import { useRouter } from "next/dist/client/router"
import PokerCard from "./PokerCard"

interface PokerTableCardProps extends FlexProps {
  id: string;
  name: string;
  bigBlind: number;
  minPlayers: number;
  maxPlayers: number;
}

const PokerTableCard: React.FC<PokerTableCardProps> = (props) => {
    const router = useRouter();

    const handleJoinTable = () => {
      router.push(`/${props.id}`);
    }

    return (
        <Flex
          gridArea={props.gridArea}
          height="100%"
          backgroundColor="gray.700"
          borderRadius="md"
          border="solid 2px"
          borderColor="purple.900"
          flexDir="column"
          alignItems="stretch"
          padding={16}
          marginLeft={4}
        >
          <Heading
            as="h1"
            position="relative"
            top="-45px"
            color="purple.500"
            size="md"
            alignSelf="center"
          >
            {props.name}
          </Heading>

          <Flex height="40%" width="100%" marginTop={-6}>
            <PokerCard
              height="100%" 
              width="50%" 
              transform="rotate(-20deg)"
              datavalue="A d"
            />
            <PokerCard
              height="100%" 
              width="50%"
              transform="rotate(-25deg)"
              datavalue={`A h`}
            />

          </Flex>

          <Heading
            as="h2"
            size="xs"
            alignSelf="center"
            marginTop={6}
          >
            Big Blind: {props.bigBlind}P$
          </Heading>

          <Button
            backgroundColor="purple.500"
            height={10}
            borderRadius="sm"
            marginTop={12}
            _hover={{ backgroundColor: 'purple.600'}}
            _focus={{}}
            onClick={handleJoinTable}
          >
            ENTRAR
          </Button>
        </Flex>
    )
}

export default PokerTableCard