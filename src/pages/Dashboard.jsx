// Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getHabits, setHabits } from "@/utils/storage";
import HabitItem from "../components/HabitItem";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabitsState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userHabits = getHabits(user.username);
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

  const handleDeleteHabit = (habitId) => {
    const updatedHabits = habits.filter((h) => h.id !== habitId);
    setHabitsState(updatedHabits);
    setHabits(user.username, updatedHabits);
  };

  const handleEditHabit = (habit) => {
    navigate(`/add?edit=${habit.id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Twoje Nawyki</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
