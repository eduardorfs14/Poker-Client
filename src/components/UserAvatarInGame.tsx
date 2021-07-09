import { Avatar, Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import PokerCard from "./PokerCard";

type UserAvatarInGameProps = {
  user: {
    id: string;
    email: string;
    balance: number;
    avatar: string;
    position: string;
    cards: string[]
  };
  isMe?: boolean;
}

export function UserAvatarInGame({ user, isMe }: UserAvatarInGameProps) {
  useEffect(() => {
    console.log(user);
  }, [])
  return (
    <Flex
      position="relative"
      className={user.position?.toLowerCase()}
      width={isMe ? '350px' : '200px'}
      borderRadius="48px"
      alignSelf={isMe ? 'flex-end': 'flex-center'}
      top={isMe ? '24' : '0'}
      alignItems="center"
      margin={2}
    >
      <Avatar
        display="flex"
        border="solid 4px #ddd"
        width="60px"
        height="60px"
        src={user.avatar}
      >
      </Avatar>
      <Box
        marginLeft={2}
        display="flex"
        flexDirection="row"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            fontWeight="bold"
            color="green.500"
          >
            {user.email}
          </Box>
          <Box>
            {user.balance}P$
          </Box>
        </Box>
        {isMe && (
          <Box
            display="flex"
            flexDirection="row"
            zIndex="200"
            marginLeft={2}
          >
            {user.cards?.map((card, index) => {
              return (
                  <PokerCard
                    key={index}
                    height="90px" 
                    width="60px"
                    fontSize="xx-large"
                    transform="rotate(20deg)"
                    datavalue={`${card[0]} ${card[1]}`}
                  />
              )
            })}
          </Box>
        )}
      </Box>
    </Flex>
  )
}