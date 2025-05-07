import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getHabits } from "@/utils/storage";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

function calculateWeeklyStats(habit) {
  const start = dayjs().startOf('week');
  const end = dayjs().endOf('week');
  
  const weekEntries = habit.entries.filter(entry =>
    dayjs(entry.date).isBetween(start, end, 'day', '[]')
  );

  if (weekEntries.length === 0) return 0;

  const totalValue = weekEntries.reduce((sum, entry) => sum + entry.value, 0);
  const averageValue = totalValue / weekEntries.length;
  return Math.round((averageValue / habit.target) * 100);
}

export default function StatsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week'));

  useEffect(() => {
    if (user) {
      setHabits(getHabits(user.username));
    }
  }, [user]);

  const getProgressColor = (percent) => {
    if (percent >= 100) return "text-green-500";
    if (percent >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Statystyki Tygodniowe</h1>
        
        <div className="grid gap-4">
          {habits.map(habit => {
            const weeklyAverage = calculateWeeklyStats(habit);
            
            return (
              <div
                key={habit.id}
                className="p-4 border rounded-lg bg-card"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {habit.category}
                    </p>
                  </div>
                  <div className={`text-xl font-bold ${getProgressColor(weeklyAverage)}`}>
                    {weeklyAverage}%
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Średnia tygodniowa: {weeklyAverage}% celu ({habit.target} {habit.unit}/dzień)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
