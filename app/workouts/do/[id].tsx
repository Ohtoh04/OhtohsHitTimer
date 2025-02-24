import React, { useEffect, useState } from 'react';
import { View, Text, Button, Vibration } from 'react-native'; // Import Vibration
import { getWorkoutById } from '@/Data/database';
import Workout from '@/Data/Entities/workout.interface';
import { useLocalSearchParams } from 'expo-router';

export default function TabataTimer() {
    const { id } = useLocalSearchParams();

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [currentPhase, setCurrentPhase] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [cycle, setCycle] = useState<number>(0);
    const [set, setSet] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            console.log("workout id in tabata", id)
            const fetchedWorkout = await getWorkoutById(+id);

            console.log("aboba", fetchedWorkout);

            if (fetchedWorkout) {
                console.log("aboba2", fetchedWorkout);

                setWorkout(fetchedWorkout);
                setTimeLeft(fetchedWorkout.PrepTime);
                setCurrentPhase('Prepare');
            }
        };

        fetchWorkout();
    }, [id]);

    useEffect(() => {
        if (!running || timeLeft <= 0 || !workout) return;
        
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [timeLeft, running]);

    useEffect(() => {
        if (!workout || timeLeft > 0) return;
        
        if (currentPhase === 'Prepare') {
            startCycle();
        } else if (currentPhase === 'Work') {
            setCurrentPhase('Rest');
            setTimeLeft(workout.RestTime);
        } else if (currentPhase === 'Rest') {
            if (cycle + 1 < workout.Cycles) {
                setCycle(cycle + 1);
                setCurrentPhase('Work');
                setTimeLeft(workout.WorkTime);
            } else {
                startSet();
            }
        } else if (currentPhase === 'RestBetweenSets') {
            startCycle();
        } else if (currentPhase === 'CalmDown') {
            setRunning(false);
            // onComplete?.();
        }
    }, [timeLeft, currentPhase]);

    const startCycle = () => {
        if (!workout) return;
        setCycle(0);
        setCurrentPhase('Work');
        setTimeLeft(workout.WorkTime);
    };

    const startSet = () => {
        if (!workout) return;
        if (set + 1 < workout.Sets) {
            setSet(set + 1);
            setCurrentPhase('RestBetweenSets');
            setTimeLeft(workout.RestBetweenSetsTime);
        } else {
            setCurrentPhase('CalmDown');
            setTimeLeft(workout.CalmDownTime);
        }
    };

    const startWorkout = () => {
        setRunning(true);
        setCurrentPhase('Prepare');
        setTimeLeft(workout?.PrepTime || 0);
    };

    const handleNext = () => {
        if (!workout) return;

        // Trigger vibration
        Vibration.vibrate(100); // Vibrate for 500ms

        if (currentPhase === 'Prepare') {
            startCycle();
        } else if (currentPhase === 'Work') {
            setCurrentPhase('Rest');
            setTimeLeft(workout.RestTime);
        } else if (currentPhase === 'Rest') {
            if (cycle + 1 < workout.Cycles) {
                setCycle(cycle + 1);
                setCurrentPhase('Work');
                setTimeLeft(workout.WorkTime);
            } else {
                startSet();
            }
        } else if (currentPhase === 'RestBetweenSets') {
            startCycle();
        } else if (currentPhase === 'CalmDown') {
            setRunning(false);
        }
    };

    const handlePrevious = () => {
        if (!workout) return;

        if (currentPhase === 'Work' && cycle > 0) {
            setCycle(cycle - 1);
            setCurrentPhase('Rest');
            setTimeLeft(workout.RestTime);
        } else if (currentPhase === 'Rest') {
            setCurrentPhase('Work');
            setTimeLeft(workout.WorkTime);
        } else if (currentPhase === 'RestBetweenSets' && set > 0) {
            setSet(set - 1);
            setCurrentPhase('Rest');
            setTimeLeft(workout.RestTime);
        } else if (currentPhase === 'CalmDown') {
            setCurrentPhase('RestBetweenSets');
            setTimeLeft(workout.RestBetweenSetsTime);
        } else if (currentPhase === 'Prepare') {
            // Do nothing, as there's no phase before "Prepare"
        }
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{currentPhase}</Text>
            <Text style={{ fontSize: 48 }}>{timeLeft}s</Text>
            <Text>Cycle: {cycle + 1} / {workout?.Cycles}</Text>
            <Text>Set: {set + 1} / {workout?.Sets}</Text>
            {!running && <Button title="Start Workout" onPress={startWorkout} />}
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Button title="Previous" onPress={handlePrevious} />
                <Button title="Next" onPress={handleNext} />
            </View>
        </View>
    );
}