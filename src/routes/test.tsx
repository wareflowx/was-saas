import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/test")({
  component: TestRoute,
})

function TestRoute() {
  return (
    <div style={{
      padding: "20px",
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
      color: "#000"
    }}>
      <h1>Page de Test</h1>
      <p>Si tu vois ce texte, le rendu fonctionne !</p>
      <button style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        Bouton de test
      </button>
    </div>
  )
}
