import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import toast from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <h1>This is main page</h1>
        <button onClick={()=>toast.success("This is toast Message")}>Click me</button>
    </div>
  )
}

export default App
