import { useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

// Zwraca tablicę 7 dni tygodnia zaczynając od poniedziałku
function getWeekDates(refDate) {
  const start = dayjs(refDate).startOf("week");
  return Array(7).fill().map((_, i) => start.add(i, "day"));
}

// Zwraca siatkę dni do wyświetlenia w kalendarzu miesiąca (z dniami z poprzedniego/następnego miesiąca)
function getMonthGrid(year, month) {
  const firstDayOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDayOfMonth = dayjs().year(year).month(month).endOf("month");
  // dayjs().day() - 0: niedziela, 1: poniedziałek, ..., 6: sobota
  // Chcemy poniedziałek jako pierwszy dzień tygodnia
  let startDay = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1;
  let endDay = lastDayOfMonth.day() === 0 ? 6 : lastDayOfMonth.day() - 1;

  // Start date to first cell in grid (may be from previous month)
  const gridStart = firstDayOfMonth.subtract(startDay, "day");
  // End date to last cell in grid (may be from next month)
  const gridEnd = lastDayOfMonth.add(6 - endDay, "day");

  const days = [];
  let current = gridStart;
  while (current.isBefore(gridEnd) || current.isSame(gridEnd)) {
    days.push(current);
    current = current.add(1, "day");
  }
  return days;
}

// Oblicza streak (ile dni z rzędu cel osiągnięty)
function calculateStreak(entries, target) {
  let streak = 0;
  let date = dayjs().startOf("day");
  const entryMap = Object.fromEntries(entries.map(e => [e.date, e.value]));
  while (true) {
    const value = entryMap[date.format("YYYY-MM-DD")];
    if (value && value >= target) {
      streak++;
      date = date.subtract(1, "day");
    } else {
      break;
    }
  }
  return streak;
}

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

export default function HabitItem({
  habit,         // obiekt nawyku: zawiera id, nazwę, cele, kategorię i wpisy (entries)
  onEdit,        // funkcja uruchamiana przy edycji
  onDelete,      // funkcja usuwająca nawyk
  onAddValue     // funkcja dodająca wartość do dnia
}) {
  const [todayValue, setTodayValue] = useState("");        // wartość do dodania dzisiaj
  const [viewMode, setViewMode] = useState("week");        // tryb wyświetlania: 'week' lub 'month'
  const [monthOffset, setMonthOffset] = useState(0);       // przesunięcie miesiąca (0 = obecny)

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

  // Streak
  const streak = calculateStreak(entries, target);

  // Obsługa miesięcy
  const refDate = dayjs().add(monthOffset, "month");
  const year = refDate.year();
  const month = refDate.month();

  // Pobiera dni na podstawie trybu widoku
  const weekDates = getWeekDates(refDate);
  const monthGrid = getMonthGrid(year, month);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {/* Górna część: nazwa nawyku, kategoria, przyciski */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
            {streak > 0 && (
              <div className="flex items-center gap-1 mt-1 text-primary font-medium">
                <span role="img" aria-label="frog">🐸</span>
                <span>{streak} {streak === 1 ? "dzień" : (streak < 5 ? "dni" : "dni")} streaku</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {/* Dialog do edycji */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit && onEdit(habit)}
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
              {target}{habit.unit ? ' ' + habit.unit : ''}
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
          <div className="flex justify-end items-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setViewMode(viewMode === "week" ? "month" : "week");
                setMonthOffset(0);
              }}
              title="Zmień widok"
            >
              {viewMode === "week" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          {/* Kalendarz */}
          <div className="w-full">
            {/* Miesiąc - na środku nad kalendarzem */}
            {viewMode === "month" && (
              <div className="flex justify-center items-center gap-2 mb-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMonthOffset(monthOffset - 1)}
                  title="Poprzedni miesiąc"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium flex items-center">
                  {refDate.format("MMMM YYYY")}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMonthOffset(monthOffset + 1)}
                  title="Następny miesiąc"
                  disabled={monthOffset >= 0}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            {/* Nagłówki dni tygodnia */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-xs text-center font-medium text-muted-foreground">{d}</div>
              ))}
            </div>
            {viewMode === "week" ? (
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map(date => {
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
                        className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium"
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
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map(date => {
                  const entry = entries.find(e =>
                    dayjs(e.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
                  );
                  const value = entry?.value || 0;
                  const percent = Math.min((value / target) * 100, 100);
                  const isCurrentMonth = date.month() === month;
                  return (
                    <div
                      key={date.format("YYYY-MM-DD")}
                      className={`flex flex-col items-center ${!isCurrentMonth ? "opacity-40" : ""}`}
                    >
                      <span className="text-xs mb-1">
                        {date.format("DD")}
                      </span>
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium"
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
