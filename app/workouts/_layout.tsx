import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack>
      <Stack.Screen name="do/[id]" options={{ title: 'Do Workout' }} />
      <Stack.Screen name="update-workout/[id]" options={{ title: 'Update Workout' }} />
    </Stack>
  );
}
