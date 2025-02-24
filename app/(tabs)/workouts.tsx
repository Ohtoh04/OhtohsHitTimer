import { Text, View, FlatList, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Link, router, useFocusEffect, useNavigation } from 'expo-router';
import { useEffect, useState } from "react";
import { deleteWorkout, getWorkouts } from "@/Data/database";
import Workout from "@/Data/Entities/workout.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function Workouts() {
  const [workouts, setWorkouts] = useState<(Workout & {id: number})[]>([]);
  const navigation = useNavigation();
  
  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("workouts");
      
      if (!storedData) {
        console.log("No workouts found, initializing storage...");
        await AsyncStorage.setItem("workouts", JSON.stringify([])); 
      }
  
      const fetchedWorkouts = await getWorkouts();
      setWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchData(); // fetch data initially on component mount
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout List</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutText}>{item.Name}</Text>
              <Text style={styles.workoutText}>Prep Time: {item.PrepTime}s</Text>
              <Text style={styles.workoutText}>Work Time: {item.WorkTime}s</Text>
              <Text style={styles.workoutText}>Rest Time: {item.RestTime}s</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => 
                  router.push({
                    pathname: '/workouts/do/[id]',
                    params: {id: item.id}
                  })}>

                <Text>Start</Text>
                
              </Pressable>
              
              <Pressable style={styles.button} onPress={() => 
                  router.push({
                    pathname: '/workouts/update-workout/[id]',
                    params: {id: item.id}
                  })}>

                <Text>Update</Text>
                
              </Pressable>

              <Pressable style={styles.button} onPress={async () => {
                await deleteWorkout(item.id);
                await fetchData();
              }}>

                <Text>Delete</Text>
                
              </Pressable>

            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "100%",
  },
  workoutInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  workoutText: {
    fontSize: 16,
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 3,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  addLink: {
    marginTop: 15,
    fontSize: 16,
    color: "#007BFF",
  },
});
