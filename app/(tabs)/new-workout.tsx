import { Text, View, StyleSheet, Button, ScrollView } from 'react-native'
import Workout from '../Data/Entities/workout.interface'
import * as SQLite from 'expo-sqlite'
import { useState } from 'react';


export default function NewWorkoutScreen() {
  const [workoutInstance, setWorkoutInstance] = useState<Workout>({
    PrepTime: 10,
    WorkTime: 20,
    RestTime: 10,
    Cycles: 8,
    Sets: 1,
    RestBetweenSetsTime: 7,
    CalmDownTime: 0,
  });

  function updateValue(property: keyof Workout, opFlag: boolean) {
    setWorkoutInstance((prev) => ({
      ...prev,
      [property]: opFlag ? prev[property] + 1 : Math.max(0, prev[property] - 1),
    }));
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>New training page</Text>
        {Object.keys(workoutInstance).map((key) => (
          <View key={key} style={styles.column}>
            <Text style={styles.label}>{key}</Text>
            <View style={styles.row}>
              <View style={styles.buttonContainer}> <Button onPress={() => updateValue(key as keyof Workout, false)} title="-" /> </View>
              <Text>{workoutInstance[key as keyof Workout]}</Text>
              <View style={styles.buttonContainer}> <Button onPress={() => updateValue(key as keyof Workout, true)} title="+" /> </View>
            </View>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <Button title="Add"/>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  column: {
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
  }
});
