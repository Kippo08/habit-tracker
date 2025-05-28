import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import { getHabits } from "@/utils/storage";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from "recharts";

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

  useEffect(() => {
    if (user) {
      setHabits(getHabits(user.username));
    }
  }, [user]);

  // Przygotuj dane do wykresu
  const chartData = habits.map(habit => ({
    name: habit.name,
    percent: calculateWeeklyStats(habit),
    category: habit.category,
    target: habit.target,
    unit: habit.unit,
  }));

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-2 sm:p-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Statystyki Tygodniowe</h1>
        <div className="w-full max-w-2xl mx-auto mb-8">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 16, right: 16, left: 8, bottom: 32 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="percent" fill="#606c38">
                <LabelList dataKey="percent" position="top" formatter={v => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
                  <div className={`text-xl font-bold`}>
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
