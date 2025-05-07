import { useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

// Zwraca tablicę 7 dni tygodnia zaczynając od poniedziałku
function getWeekDates() {
  const start = dayjs().startOf("week");
  return Array(7).fill().map((_, i) => start.add(i, "day"));
}

// Zwraca wszystkie dni w aktualnym miesiącu
function getMonthDates() {
  const start = dayjs().startOf("month");
  const end = dayjs().endOf("month");
  const days = [];
  let current = start;

  while (current.isBefore(end) || current.isSame(end)) {
    days.push(current);
    current = current.add(1, "day");
  }

  return days;
}

export default function HabitItem({
  habit,         // obiekt nawyku: zawiera id, nazwę, cele, kategorię i wpisy (entries)
  onEdit,        // funkcja uruchamiana przy edycji
  onDelete,      // funkcja usuwająca nawyk
  onAddValue     // funkcja dodająca wartość do dnia
}) {
  const [todayValue, setTodayValue] = useState("");        // wartość do dodania dzisiaj
  const [viewMode, setViewMode] = useState("week");        // tryb wyświetlania: 'week' lub 'month'
  const [open, setOpen] = useState(false);                 // kontrola widoczności dialogu

  const { name, target, entries = [], category } = habit;

  // Dodaje nową wartość dzisiaj
  const handleAddValue = () => {
    if (!todayValue) return;
    onAddValue(habit.id, parseFloat(todayValue));
    setTodayValue("");
  };

  // Oblicza dzisiejszy postęp jako procent celu
  const getTodayProgress = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const todayEntry = entries.find(e => e.date === today);
    return todayEntry ? Math.min((todayEntry.value / target) * 100, 100) : 0;
  };

  // Zwraca kolor postępu (od czerwonego do zielonego)
  function getProgressColor(percent) {
    const clamped = Math.min(Math.max(percent, 0), 100);
    if (clamped < 50) {
      return `hsl(${(clamped / 50) * 39}, 100%, 50%)`; 
    } else {
      return `hsl(${39 + ((clamped - 50) / 50) * (120 - 39)}, 100%, 50%)`;
    }
  }

  // Pobiera dni na podstawie trybu widoku
  const dates = viewMode === "week" ? getWeekDates() : getMonthDates();

  return (
    <Card className="w-full md:w-[400px]">
      <CardContent className="p-4">
        {/* Górna część: nazwa nawyku, kategoria, przyciski */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <div className="flex gap-2">
            {/* Dialog do edycji */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            {/* Usuwanie */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(habit.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Wartość dnia dzisiejszego */}
        <div className="space-y-4">
          <div className="flex gap-1 items-center">
            <Input
              type="number"
              value={todayValue}
              onChange={(e) => setTodayValue(e.target.value)}
            />/
            <span>
              {target}{habit.unit ? '' + habit.unit : ''}
            </span>
            <Button onClick={handleAddValue}>Dodaj</Button>
          </div>

          {/* Pasek postępu */}
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              style={{
                width: `${getTodayProgress()}%`,
                height: '100%',
                backgroundColor: getProgressColor(getTodayProgress()),
                transition: 'width 0.3s ease, background-color 0.3s ease'
              }}
            />
          </div>

          {/* Przełącznik tygodni/miesiąc */}
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setViewMode(viewMode === "week" ? "month" : "week")}
              title="Zmień widok"
            >
              {viewMode === "week" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          {/* Kalendarz */}
          <div className={`grid ${viewMode === "week" ? "grid-cols-7" : "grid-cols-7"} gap-1`}>
            {dates.map(date => {
              const entry = entries.find(e => 
                dayjs(e.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
              );
              const value = entry?.value || 0;
              const percent = Math.min((value / target) * 100, 100);

              return (
                <div 
                  key={date.format("YYYY-MM-DD")} 
                  className="flex flex-col items-center"
                >
                  <span className="text-xs mb-1">
                    {date.format("DD")}
                  </span>
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      backgroundColor: getProgressColor(percent),
                      transition: 'background-color 0.3s ease'
                    }}
                    title={`${value}/${target}${habit.unit ? ' ' + habit.unit : ''}`}
                  >
                    <span className="text-black">
                      {Math.round(percent)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
