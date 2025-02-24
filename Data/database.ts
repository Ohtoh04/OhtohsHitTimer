import AsyncStorage from '@react-native-async-storage/async-storage';
import Workout from './Entities/workout.interface';

// Storage key for workouts
const STORAGE_KEY = 'workouts';

// Initialize storage
export const initializeDatabase = async () => {
    try {
        const existingWorkouts = await AsyncStorage.getItem(STORAGE_KEY);
        if (!existingWorkouts) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            console.log('Database initialized');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Insert a new workout
export const insertWorkout = async (workout: Workout) => {
    try {
        const workouts = await getWorkouts();
        const newWorkout = {
            id: Date.now(), // Assign unique ID
            ...workout
        };
        workouts.push(newWorkout);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        console.log('Workout inserted:', newWorkout);
    } catch (error) {
        console.error('Error inserting workout:', error);
    }
};

export const getWorkoutById = async (id: number): Promise<Workout | null> => {
    try {
        const workouts = await getWorkouts();
        console.log("workouts i workoutById:", workouts);
        console.log("passed id:", id)

        const retworkout = workouts.find(workout => workout.id == id);
        console.log("workouts to return:", retworkout)

        return workouts.find(workout => workout.id === id) || null;
    } catch (error) {
        console.error('Error fetching workout by ID:', error);
        return null;
    }
};

// Get all workouts
export const getWorkouts = async (): Promise<(Workout & { id: number })[]> => {
    try {
        const storedWorkouts = await AsyncStorage.getItem(STORAGE_KEY);
        return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }
};

export const updateWorkout = async (id: number, updatedWorkout: Partial<Workout>) => {
    try {
        let workouts = await getWorkouts();
        const index = workouts.findIndex(workout => workout.id === id);
        if (index !== -1) {
            workouts[index] = { ...workouts[index], ...updatedWorkout };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
            console.log(`Workout with ID ${id} updated`);
        } else {
            console.warn(`Workout with ID ${id} not found`);
        }
    } catch (error) {
        console.error('Error updating workout:', error);
    }
};

// Delete a workout by ID
export const deleteWorkout = async (id: number) => {
    try {
        let workouts = await getWorkouts();
        workouts = workouts.filter(workout => workout.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        console.log(`Workout with ID ${id} deleted`);
    } catch (error) {
        console.error('Error deleting workout:', error);
    }
};
