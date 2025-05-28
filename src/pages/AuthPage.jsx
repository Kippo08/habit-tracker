import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const { login, register } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = isLogin ? login(username, password) : register(username, password)
    if (!success) setError("Nieprawidłowe dane lub użytkownik już istnieje.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-background">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md border border-border">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isLogin ? "Logowanie" : "Rejestracja"}
        </h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          className="w-full mb-3 p-2 rounded bg-muted text-foreground"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          className="w-full mb-3 p-2 rounded bg-muted text-foreground"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <Button type="submit" className="w-full">{isLogin ? "Zaloguj się" : "Zarejestruj się"}</Button>
        <p
          className="text-sm text-center mt-4 cursor-pointer text-primary hover:underline"
          onClick={() => {
            setIsLogin(!isLogin)
            setError("")
          }}
        >
          {isLogin ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
        </p>
      </form>
    </div>
  )
}
