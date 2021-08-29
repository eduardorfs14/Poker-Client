import { Avatar, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { useState } from 'react';
import PokerCard from './PokerCard';

export type PlayerEndRoundInfo = {
  id: string;
  name: string,
  avatar_url: string,
  totalBetValue: number,
  folded: boolean,
  profit: number,
  cards: string[]
}

type ChakraModalProps = {
  playersEndRoundInfo: PlayerEndRoundInfo[] | undefined
}

const ChakraModal = ({ playersEndRoundInfo }: ChakraModalProps) => {
  console.log(playersEndRoundInfo);

  const [isOpen, setIsOpen] = useState(true);

  function onClose() {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resultado da rodada:</ModalHeader>
          <ModalCloseButton />
            {playersEndRoundInfo?.map(player => {
              return (
                <ModalBody display="flex" justifyContent="center" alignItems="center" marginBottom={3}>
                  <Avatar src={player.avatar_url} marginRight={2} />
                  {`${player.name} apostou ${player.totalBetValue}P$. ${player.folded ? 'FOLDOU.' : ''} Lucrou: ${player.profit}P$.`}
                  {player.cards.map((card, index) => {
                    return (
                      <PokerCard
                        key={index}
                        height="90px" 
                        width="60px"
                        transform="rotate(0deg)"
                        fontSize="md"
                        datavalue={`${card[0]} ${card[1]}`}
                        margin={2}
                      />
                    )
                  })}
                </ModalBody>
              )
            })}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChakraModal
