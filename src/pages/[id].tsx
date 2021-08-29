import { useContext, useState } from "react";
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Flex, Input, Avatar, useToast, Heading } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import PokerCard from '../components/PokerCard';
import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { AuthContext } from "../contexts/auth/AuthContext";
import { io, Socket } from "socket.io-client";
import ChakraModal, { PlayerEndRoundInfo } from "../components/ChakraModal";

type TableType = {
    id: string;
    name: string;
    bigBlind: number;
    minPlayers: number;
    maxPlayers: number;
    houseSlice: number;
    active: boolean;
}

type Player = {
    id: string;
    name: string;
    email: string;
    balance: number;
    totalBetValueOnRound: number;
    position: string;
    folded: boolean;
    avatar_url: string;
    cards: string[]
}

export let socket: Socket;

const Table: React.FC = () => {
    const { user } = useContext(AuthContext);

    const [betInputValue, setBetInputValue] = useState('0');
    const [socketState, setSocketState] = useState<Socket>();
    const [player, setPlayer] = useState<Player>();
    const [players, setPlayers] = useState<Player[]>();
    const [minBetMsg, setMinBetMsg] = useState('');
    const [gameMsg, setGameMsg] = useState('');
    const [turnMsg, setTurnMsg] = useState('');
    const [table, setTable] = useState<TableType | null>(null);
    const [tableCards, setTableCards] = useState<string[]>([])
    const [combination, setCombination] = useState('');
    const [shouldLoadModal, setShouldLoadModal] = useState(false);
    const [modalInfo, setModalInfo] = useState<PlayerEndRoundInfo[]>();

    const toast = useToast();

    const  { query } = useRouter();
    const tableId = query.id;

    useEffect(() => {
        if (tableId) {
            supabase
            .from('poker_tables')
            .select()
            .eq('id', tableId)
            .then(res => {
                if (res.data) setTable(res?.data[0]);
            });
        }

        socket = io(process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : '');
        socket.on('connect', () => {
            socket.on('round_already_started', msg => addToast(msg));

            socket.on('min_bet', minBet => setMinBetMsg(`Aposta mínima: ${minBet}P$`));
            socket.on('player', player => setPlayer(player));
            socket.on('all_players', players => setPlayers(players));
            socket.on('table_cards', tableCards => setTableCards(tableCards));
            socket.on('combination', combination => setCombination(combination));
            socket.on('round_pot', pot => {
                const tempo_intervalo = 5; //ms -> define a velocidade da animação
                const tempo = 4000; //ms -> define o tempo total da animaçao

                const count_to = parseInt(pot);
                const intervalos = tempo / tempo_intervalo; //quantos passos de animação tem
                const incremento = count_to / intervalos; //quanto cada contador deve aumentar
                const el = document.querySelector('.counter-up');
                if (!el) return;
                let valor = pot;
                
                let timer = setInterval(function() {
                    if (valor >= count_to) { // se já contou tudo tem de parar o timer
                        valor = count_to;
                        clearInterval(timer);
                    }
                    
                    const text = `POT: ${valor.toFixed(0)}P$`
                    const formatedText = text.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                    el.innerHTML = formatedText;
                    valor += incremento;
                }, tempo_intervalo);
            });
            socket.on('bet_response', msg => addToast(msg, 'info'));
            socket.on('timer', playerWithTimer => {
                setTurnMsg(`Vez de ${playerWithTimer.name}. ${playerWithTimer.timeToPlay}s`);
            });
            socket.on('your_turn', () => addToast('Sua vez de jogar!', 'info'));
            socket.on('error_msg', msg => addToast(msg, 'error'));
            socket.on('round_result', resultInfo => {
                setModalInfo(resultInfo);
                setShouldLoadModal(true);
            });

            setTimeout(() => {
                socket.emit('join_table', tableId);
            }, 1000);
        })
        setSocketState(socket);
    }, [tableId]);

    function joinTable() {
        // Entrar na mesa...
        socket?.emit('player', user);    
    };

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

    async function sendBet(type: 'fold' | 'check' | 'call' | undefined) {
        if (!type) {
            socket?.emit('new_bet', parseInt(betInputValue));
        } else {
            socket?.emit('new_bet', type);
        }
    }

    return (
        player ? (
            <div>
            <Navbar />
            <Flex
                height="calc(100vh - 70px - 24px)"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
            >
                <Heading
                    as="h1"
                    marginBottom={2}
                >{turnMsg}</Heading>
                <Heading
                    as="h2"
                    marginBottom={2}
                    className="counter-up"
                >{gameMsg}</Heading>
                <Heading
                    as="h3"
                    marginBottom={2}
                >{minBetMsg}</Heading>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="650px"
                    width="750px"
                    borderRadius="full"
                    backgroundColor="gray.500"
                    border="solid 16px"
                    borderColor="gray.600"
                    marginRight={16}
                >
                    {tableCards.map((card, index) => {
                        return (
                            <PokerCard
                                key={index}
                                height="180px" 
                                width="100px"
                                transform="rotate(0deg)"
                                datavalue={`${card[0]} ${card[1]}`}
                                margin={2}
                            />
                        )
                    })}
                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDir="row"
                    height="100px"
                    width="100%"
                    marginBottom={32}
                >

                {players?.map(player => {
                    return (
                        <Flex
                            key={player.id}
                            position="relative"
                            width="180px"
                            borderRadius="48px"
                            alignSelf="flex-end"
                            display="flex"
                            flexDir="row"
                            top="24"
                            alignItems="center"
                            opacity={player.folded ? "0.3" : "1"}
                            margin={2}
                        >
                            <Box
                                display="flex"
                                flexDir="column"
                                alignItems="center"
                                marginRight={16}
                            >
                                <Avatar
                                display="flex"
                                border="solid 4px #ddd"
                                width="60px"
                                height="60px"
                                src={player.avatar_url}
                                >
                                </Avatar>
                                <Box
                                    color="green.500"
                                    fontWeight="bold"
                                >
                                    {player.name}
                                </Box>
                                <Box>
                                    {player.balance}
                                </Box>
                                <Box>
                                    Bet: {player.totalBetValueOnRound}
                                </Box>
                                <Box>
                                    Pos: {player.position}
                                </Box>
                            </Box>
                        </Flex>
                    )
                })}

                {player && (
                    <Flex
                        position="relative"
                        width="380px"
                        borderRadius="48px"
                        alignSelf="flex-end"
                        top="24"
                        alignItems="center"
                        opacity={player.folded ? "0.3" : "1"}
                        margin={2}
                      >
                        <Avatar
                          display="flex"
                          border="solid 4px #ddd"
                          width="60px"
                          height="60px"
                          src={player.avatar_url}
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
                              {player.name}
                            </Box>
                            <Box>
                              {player.balance}P$
                            </Box>
                            <Box>
                                Bet: {player.totalBetValueOnRound}
                            </Box>
                            <Box>
                                Pos: {player.position}
                            </Box>
                          </Box>
                        <Box
                            display="flex"
                            flexDirection="row"
                            zIndex="200"
                            marginLeft={4}
                        >
                            {player.cards?.map((card: string, index) => {
                                const value = card.split('')[0]
                                const naipe = card.split('')[1]

                                let datavalue = ''
                                let color = ''

                                if (naipe === 'd' || naipe === 'h') {
                                    if (value === 'T' && naipe === 'h') {
                                        datavalue = '10 ♥'
                                    } else if (value === 'T' && naipe === 'd') {
                                        datavalue = '10 ♦'
                                    } else if (naipe === 'h') {
                                        datavalue = `${value} ♥`
                                    } else if (naipe === 'd') {
                                        datavalue = `${value} ♦`
                                    }
                                    color = 'red.500'
                                } else if (naipe === 'c' || naipe === 's') {
                                    if (value === 'T' && naipe === 'c') {
                                        datavalue = '10 ♣'
                                    } else if (value === 'T' && naipe === 's') {
                                        datavalue = '10 ♠'
                                    } else if (naipe === 's') {
                                        datavalue = `${value} ♠`
                                    } else if (naipe === 'c') {
                                        datavalue = `${value} ♣`
                                    }
                                    color = 'black'
                                }

                                return (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        backgroundColor="white"
                                        color={color}
                                        borderColor={color}
                                        border="solid 2px"
                                        borderRadius="lg"
                                        fontSize="xx-large"
                                        userSelect="none"
                                        key={index}
                                        height="90px" 
                                        width="60px"
                                        transform="rotate(20deg)"
                                        _before={{ position: 'absolute', content: 'attr(data-value)', fontSize: '16px', top: '8px', left: '8px' }}
                                        _after={{ position: 'absolute', content: 'attr(data-value)', fontSize: '16px', bottom:  '8px', right: '8px', transform: 'rotate(180deg)' }}
                                        data-value={datavalue}
                                    >
                                        {datavalue.split(' ')[1]}
                                    </Box>
                                )
                            })}
                        </Box>
                        </Box>
                        <Box marginLeft={4}>
                            {combination}
                        </Box>
                      </Flex>
                )}
                </Box>

                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    marginBottom={4}
                >
                    <Input
                        width="200px"
                        margin={3}
                        type="number"
                        background="gray.600"
                        height="40px"
                        border="none"
                        outline="none"
                        _focus={{}}
                        onChange={event => setBetInputValue(event.target.value)}
                        value={betInputValue}
                        placeholder="000"
                    />
                    <Button
                        margin={3}
                        display="flex"
                        justifyContent="center"
                        width="250px"
                        color="white"
                        backgroundColor="purple.500"
                        borderRadius="md"
                        onClick={() => sendBet(undefined)}
                        _hover={{ backgroundColor: "purple.600" }}
                        _focus={{}}
                    >
                        Bet
                    </Button>

                    <Button
                        margin={3}
                        display="flex"
                        justifyContent="center"
                        width="250px"
                        color="white"
                        backgroundColor="purple.500"
                        borderRadius="md"
                        onClick={() => sendBet('fold')}
                        _hover={{ backgroundColor: "purple.600" }}
                        _focus={{}}
                    >
                        Fold
                    </Button>

                    <Button
                        margin={3}
                        display="flex"
                        justifyContent="center"
                        width="250px"
                        color="white"
                        backgroundColor="purple.500"
                        borderRadius="md"
                        onClick={() => sendBet('check')}
                        _hover={{ backgroundColor: "purple.600" }}
                        _focus={{}}
                    >
                        Check / Call
                    </Button>
                </Box>
            </Flex>

            { shouldLoadModal ? <ChakraModal playersEndRoundInfo={modalInfo} /> : '' }
        </div>
        ) : (
            <div>
                <Navbar />
                <Flex
                    height="calc(100vh - 70px - 24px)"
                    alignContent="center"
                    justifyContent="center"
                >
                    <Button
                        display="flex"
                        justifyContent="center"
                        color="white"
                        backgroundColor="purple.500"
                        borderRadius="md"
                        onClick={joinTable}
                        _hover={{ backgroundColor: "purple.600" }}
                        _focus={{}}
                        marginLeft={4}
                        marginTop={10}
                    >
                        Entrar na mesa
                    </Button>
                </Flex>
            </div>
        )
    );
};

export default Table;