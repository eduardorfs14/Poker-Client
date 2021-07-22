import { Session } from "@supabase/gotrue-js";
import { createContext, useEffect } from "react";
import { useState } from "react";

import { User, AuthContextType, SignInRequestData, SignUpRequestData } from "../../interfaces/auth";
import { supabase } from "../../utils/supabaseClient";

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user;

  useEffect(() => {
    const session = supabase.auth.session();
    if (session) {
      const { user } = session;

      supabase
      .from('users')
      .select()
      .eq('id', user?.id)
      .then(data => {
        if (!data.data) {
          setUser(null);
          return;
        }
        const user = data.data[0]
        setUser(user);
      });
    }
    
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const { user } = session;
  
        const unsubscribe = supabase
        .from('users')
        .select()
        .eq('id', user?.id)
        .then(data => {
          if (!data.data) {
            setUser(null);
            return;
          }
    
          const user = data.data[0]
          setUser(user);
        });
        return () => {
          unsubscribe
        };
      }
    });
  }, []);

  async function signIn({ email, password }: SignInRequestData) {
    const { error } = await supabase.auth.signIn({ email, password });
  
    if (error) throw error;
  }

  async function signUp({ name, email, password }: SignUpRequestData) {
    const { error, user } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    await supabase.from('users').insert([
      {
        id: user?.id,
        email: user?.email, 
        name,
      }
    ]).throwOnError();
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
