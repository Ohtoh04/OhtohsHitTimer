import * as SQLite from 'expo-sqlite';
import Workout from './types';

// Open the database connection
export const openDatabase = () => {
    return SQLite.openDatabaseSync('mydatabase.db'); // Synchronous to avoid race conditions
};

// Initialize tables
export const initializeDatabase = async () => {
    const db = openDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Workout (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            PrepTime INTEGER NOT NULL CHECK (PrepTime >= 0),
            WorkTime INTEGER NOT NULL CHECK (WorkTime >= 0),
            RestTime INTEGER NOT NULL CHECK (RestTime >= 0),
            Cycles INTEGER NOT NULL CHECK (Cycles >= 0),
            Sets INTEGER NOT NULL CHECK (Sets >= 0),
            RestBetweenSetsTime INTEGER NOT NULL CHECK (RestBetweenSetsTime >= 0),
            CalmDownTime INTEGER NOT NULL CHECK (CalmDownTime >= 0)
        );
    `);
    console.log('Database initialized');
};

// Insert a workout
export const insertWorkout = async (workout: Workout) => {
    const db = openDatabase();
    await db.runAsync(
        `INSERT INTO Workout (name, PrepTime, WorkTime, RestTime, Cycles, Sets, RestBetweenSetsTime, CalmDownTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
            workout.name,
            workout.PrepTime,
            workout.WorkTime,
            workout.RestTime,
            workout.Cycles,
            workout.Sets,
            workout.RestBetweenSetsTime,
            workout.CalmDownTime
        ]
    );
};

// Get all workouts
export const getWorkouts = async (): Promise<Workout[]> => {
    const db = openDatabase();
    const results = await db.getAllAsync(`SELECT * FROM Workout;`);
    return results as Workout[];
};

// Delete a workout by ID
export const deleteWorkout = async (id: number) => {
    const db = openDatabase();
    await db.runAsync(`DELETE FROM Workout WHERE id = ?;`, [id]);
};
