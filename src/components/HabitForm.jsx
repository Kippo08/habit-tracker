import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  { id: "health", name: "Zdrowie" },
  { id: "education", name: "Nauka" },
  { id: "addiction", name: "Używki"},
  { id: "other", name: "Inne" }
];

export default function HabitForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "");
  const [unit, setUnit] = useState(initialData.unit || "");
  const [target, setTarget] = useState(initialData.target || "");
  const [category, setCategory] = useState(initialData.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || !category) return;

    const habit = {
      name,
      unit,
      target: parseFloat(target),
      category,
      id: initialData.id || Date.now(),
      entries: initialData.entries || []
    };

    onSubmit(habit);

    if (!initialData.id) {
      setName("");
      setUnit("");
      setTarget("");
      setCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nazwa nawyku</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Np. Pić wodę"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Kategoria</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        >
          <option value="" >Wybierz kategorię</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="unit">Jednostka (opcjonalna)</Label>
        <Input
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Np. litry, minuty"
        />
      </div>

      <div>
        <Label htmlFor="target">Cel dzienny</Label>
        <Input
          id="target"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Np. 2"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData.id ? "Zapisz zmiany" : "Dodaj nawyk"}
      </Button>
    </form>
  );
}
