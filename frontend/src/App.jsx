import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ThemeFunction } from "./context/ThemeContext"
import Signup from "./pages/Signup"

function App() {

  return (
    <ThemeFunction>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </ThemeFunction>
  )
}

export default App
