import HabitForm from "@/components/HabitForm";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthContext";
import { getHabits, setHabits } from "@/utils/storage";
import { toast } from "sonner";


export default function AddHabitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const habits = user ? getHabits(user.username) : [];
  const params = new URLSearchParams(location.search);
  const editingId = params.get("edit");
  const initialData = habits.find(h => h.id == editingId) || {};


  const handleAddHabit = (habit) => {
    let updatedHabits;
    if (editingId) {
      updatedHabits = habits.map(h => h.id == editingId ? habit : h);
      toast.success("Nawyk zaktualizowany!");
    } else {
      updatedHabits = [...habits, habit];
      toast.success("Nawyk dodany!");
    }
    setHabits(user.username, updatedHabits);
    navigate("/");
  };


  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {editingId ? "Edytuj nawyk" : "Dodaj nawyk"}
          </h1>
          <HabitForm onSubmit={handleAddHabit} initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
