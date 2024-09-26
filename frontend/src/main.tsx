import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TodoCalendar } from './TodoCalendar.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoCalendar />
  </StrictMode>,
)
