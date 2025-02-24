import { Tabs } from "expo-router";


export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="workouts" options={{ title: 'Workouts' }}/>
            <Tabs.Screen name="new-workout" options={{ title: 'New workout' }}/>
            <Tabs.Screen name="settings" options={{ title: 'Settings' }}/>
        </Tabs>
    );
}