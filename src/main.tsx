import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import App from "./App.tsx"

const renderer = await createCliRenderer({
  // Optional renderer configuration
  
  exitOnCtrlC: false,
})
createRoot(renderer).render(<App />)