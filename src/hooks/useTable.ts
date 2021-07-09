import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { supabase } from "../utils/supabaseClient";

type TableType = {
  name: string;
  bigBlind: number;
  minBuyin: number;
  maxBuyin: number;
  minPlayers: number;
  maxPlayers: number;
  active: boolean;
  players: [{ 
    avatarURL: string;
    balance: number;
  }]
}

type FirebaseTable = Record<string, {
  name: string;
  bigBlind: number;
  minBuyin: number;
  maxBuyin: number;
  minPlayers: number;
  maxPlayers: number;
  active: boolean;
  players: [{ 
      avatarURL: string;
      balance: number;
  }]
}>

export function useTable(tableId: string) {
  const [table, setTable] = useState<any>();

  useEffect(() => {
    const tableRef = database.ref(`tables/${tableId}`);

    tableRef.on('value', table => {
      const databaseTable = table.val();

      const firebaseTable: FirebaseTable = databaseTable ?? {};

      setTable(firebaseTable);
    });

    return () => {
      tableRef.off('value');
    }

  }, [tableId]);

  return { table }
}