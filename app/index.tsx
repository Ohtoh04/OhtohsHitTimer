import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/workouts");
    }, 0); 

    return () => clearTimeout(timeout); 
  }, []);

  return <View />; 
}
