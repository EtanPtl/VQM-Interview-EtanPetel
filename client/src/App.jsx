import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Queue from "./pages/Queue"
function App() {
  // Creating Routes 
  return (
    <Routes>
      <Route path="/" element={<Home/>}>
        <Route path="/SignUp" index element={<SignUp/>} />
        <Route path="/Queue" index element={<Queue/>}/>

      </Route>
    </Routes>
  )
}

export default App
