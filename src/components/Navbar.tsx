import { Avatar } from "@chakra-ui/avatar"
import { Flex, FlexProps, Text, Link } from "@chakra-ui/layout"
import router from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext"
import { supabase } from "../utils/supabaseClient";

const Navbar: React.FC<FlexProps> = (props) => {
  const { user, signOut } = useContext(AuthContext);
  const [stateUser, setUser] = useState(user);

  useEffect(() => {
    setUser(user);
  }, [user]);

  async function getBalance() {
    const { data } = await supabase.from('users').select().eq('id', user?.id);
    if (data) {
      setUser(data[0]);
    }
  }

  if (!user) {
    return (
      <Flex
        as="nav"
        alignItems="center"
        justifyContent="flex-end"
        height="70px"
        marginBottom={6}
        {...props}
      >
        <Link
          href="/login"
          marginRight={12}
          padding={2}
          borderRadius="sm"
          _focus={{}}
          _hover={{ color: "purple.500" }}
        >
          LOGIN
        </Link>
      </Flex>
    )
  }

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  async function addBalance() {
    const balanceToAdd = 10000;
    const { data } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user?.id);

    if (!data) {
      return;
    }

    await supabase
      .from('users')
      .update({ balance: data[0].balance + balanceToAdd })
      .eq('id', user?.id);

    supabase
      .from('users')
      .select()
      .eq('id', user?.id)
      .then(data => {
        if (!data.data) {
          return;
        }

        setUser(data.data[0])
      });
  }

  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="flex-end"
      height="70px"
      marginBottom={6}
      {...props}
    >

      <Link
        marginRight={12}
        padding={2}
        borderRadius="sm"
        _hover={{ color: "purple.500" }}
        onClick={addBalance}
      >
        ADD
      </Link>

      <Text
        fontSize="xl"
        marginRight={12}
        padding={2}
        borderRadius="sm"
      >
        {stateUser?.name}
      </Text>

      <Text
        fontSize="xl"
        marginRight={12}
        padding={2}
        borderRadius="sm"
        _hover={{ color: "purple.500", cursor: "pointer" }}
        onClick={getBalance}
      >
        {stateUser?.balance}P$
      </Text>

      <Link 
        marginRight={12}
        padding={2}
        borderRadius="sm"
        _hover={{ color: "purple.500" }}
        onClick={handleSignOut}
      >
        LOGOUT
      </Link>

      <Link marginRight={20} _hover={{ transform: "scale(1.2)" }}>
        <Avatar name="placeholder" src={stateUser?.avatar_url}></Avatar> 
      </Link>
    </Flex>
  )
}

export default Navbar