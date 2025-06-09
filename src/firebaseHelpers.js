// src/firebaseHelpers.js
import { db } from './firebaseConfig';
import { setDoc, doc, getDoc, getDocs, collection } from 'firebase/firestore';

// Save a workout
export async function saveWorkout(dateKey, workoutData) {
  try {
    await setDoc(doc(db, "workouts", dateKey), workoutData);
  } catch (err) {
    console.error("Error saving workout:", err);
  }
}

// Load a single workout
export async function loadWorkout(dateKey) {
  try {
    const workoutRef = doc(db, "workouts", dateKey);
    const snapshot = await getDoc(workoutRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (err) {
    console.error("Error loading workout:", err);
  }
}

// Load all workouts
export async function loadAllWorkouts() {
  try {
    const snapshot = await getDocs(collection(db, "workouts"));
    const workouts = {};
    snapshot.forEach(doc => {
      workouts[doc.id] = doc.data();
    });
    return workouts;
  } catch (err) {
    console.error("Error loading all workouts:", err);
  }
}