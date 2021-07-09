import { Box, BoxProps } from "@chakra-ui/layout";
import { useEffect } from "react";
import { useState } from "react";

interface CardProps extends BoxProps {
    datavalue: string;
}

const PokerCard: React.FC<CardProps> = (props) => {
    const [datavalue, setDatavalue] = useState('');

    let [color, setColor] = useState('');

    const value = props.datavalue.split(' ')[0]
    const naipe = props.datavalue.split(' ')[1]

    useEffect(() => {
        if (naipe === 'd' || naipe === 'h') {
            if (value === 'T' && naipe === 'h') {
                setDatavalue('10 ♥')
            } else if (value === 'T' && naipe === 'd') {
                setDatavalue('10 ♦')
            } else if (naipe === 'h') {
                setDatavalue(`${value} ♥`)
            } else if (naipe === 'd') {
                setDatavalue(`${value} ♦`)
            }
            setColor('red.500');
        } else if (naipe === 'c' || naipe === 's') {
            if (value === 'T' && naipe === 'c') {
                setDatavalue('10 ♣')
            } else if (value === 'T' && naipe === 's') {
                setDatavalue('10 ♠')
            } else if (naipe === 's') {
                setDatavalue(`${value} ♠`)
            } else if (naipe === 'c') {
                setDatavalue(`${value} ♣`)
            }
            setColor('black');
        }
    }, []);

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
            fontSize="xxx-large"
            userSelect="none"
            _before={{ position: 'absolute', content: 'attr(data-value)', fontSize: '16px', top: '8px', left: '8px' }}
            _after={{ position: 'absolute', content: 'attr(data-value)', fontSize: '16px', bottom:  '8px', right: '8px', transform: 'rotate(180deg)' }}
            {...props}
            data-value={datavalue}
        >
            {datavalue.split(' ')[1]}
        </Box>
    )
}

export default PokerCard;