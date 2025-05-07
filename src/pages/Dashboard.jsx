// Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getHabits, setHabits } from "@/utils/storage";
import HabitItem from "../components/HabitItem";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabitsState] = useState([]);

  useEffect(() => {
    if (user) {
      const username = localStorage.getItem("habit-current-user"); // Pobranie username z localStorage
      const userHabits = getHabits(username); // Pobranie nawyków
      setHabitsState(userHabits);
    }
  }, [user]);

  const handleAddValue = (habitId, value) => {
    const today = dayjs().format("YYYY-MM-DD");
    const updatedHabits = habits.map((habit) => {
      if (habit.id !== habitId) return habit;

      const existingEntryIndex = habit.entries.findIndex((e) => e.date === today);

      const newEntries = [...habit.entries];
      if (existingEntryIndex >= 0) {
        newEntries[existingEntryIndex] = { date: today, value };
      } else {
        newEntries.push({ date: today, value });
      }

      return { ...habit, entries: newEntries };
    });

    setHabitsState(updatedHabits);
    setHabits(user.username, updatedHabits);
  };

  const handleEditHabit = (habit) => {
    navigate(`/edit/${habit.id}`);
  };

  const handleDeleteHabit = (habitId) => {
    const updatedHabits = habits.filter((h) => h.id !== habitId);
    setHabitsState(updatedHabits);
    setHabits(user.username, updatedHabits);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Twoje Nawyki</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              onAddValue={handleAddValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
