import { Text, View } from "react-native";
import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { createTables, openDatabase } from "@/Data/database";
import { SQLiteDatabase } from "expo-sqlite";

export default function Workouts() {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabase();
      if(database) {
        setDb(database);
        await createTables(database);
      }
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/new-workout">Add workout</Link>
    </View>
  );
}
