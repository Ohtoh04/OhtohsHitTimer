import { Text, View, StyleSheet, Button, ScrollView, TextInput } from 'react-native';
import Workout from '@/Data/Entities/workout.interface';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { insertWorkout, updateWorkout } from '@/Data/database';
import { useTheme } from '@/context/theme-context'; 

export default function NewWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme(); 

  const [workoutInstance, setWorkoutInstance] = useState<Workout>({
    Name: 'New workout',
    PrepTime: 10,
    WorkTime: 20,
    RestTime: 10,
    Cycles: 8,
    Sets: 1,
    RestBetweenSetsTime: 7,
    CalmDownTime: 0,
  });

  type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
  }[keyof T];

  function updateValue(property: NumericKeys<Workout>, opFlag: boolean) {
    setWorkoutInstance((prev) => ({
      ...prev,
      [property]: opFlag ? prev[property] + 1 : Math.max(0, prev[property] - 1),
    }));
  }

  function updateTextValue(property: 'Name', value: string) {
    setWorkoutInstance((prev) => ({
      ...prev,
      [property]: value,
    }));
  }

  async function editWorkout(workoutInstance: Workout) {
    console.log('workout id in tabata', id);
    await updateWorkout(+id, workoutInstance);
  }


  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: theme === 'dark' ? '#121212' : '#fff', 
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: theme === 'dark' ? '#fff' : '#000', 
    },
    column: {
      alignItems: 'center',
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: theme === 'dark' ? '#fff' : '#000', 
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      marginHorizontal: 20,
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#ccc', 
      padding: 8,
      width: 200,
      color: theme === 'dark' ? '#fff' : '#000', 
      backgroundColor: theme === 'dark' ? '#333' : '#fff', 
    },
  });

  return (
    <ScrollView style={{ backgroundColor: theme === 'dark' ? '#121212' : '#fff' }}>
      <View style={themeStyles.container}>
        <Text style={themeStyles.text}>Update workout</Text>
        {Object.keys(workoutInstance).map((key) => (
          <View key={key} style={themeStyles.column}>
            <Text style={themeStyles.label}>{key}</Text>
            {key === 'Name' ? (
              <TextInput
                style={themeStyles.input}
                value={workoutInstance.Name}
                onChangeText={(text) => updateTextValue('Name', text)}
              />
            ) : (
              <View style={themeStyles.row}>
                <View style={themeStyles.buttonContainer}>
                  <Button
                    onPress={() => updateValue(key as NumericKeys<Workout>, false)}
                    title="-"
                  />
                </View>
                <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                  {workoutInstance[key as keyof Workout]}
                </Text>
                <View style={themeStyles.buttonContainer}>
                  <Button
                    onPress={() => updateValue(key as NumericKeys<Workout>, true)}
                    title="+"
                  />
                </View>
              </View>
            )}
          </View>
        ))}

        <View style={themeStyles.buttonContainer}>
          <Button
            title="update"
            onPress={async () => {
              await editWorkout(workoutInstance);
              router.back();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}