import { Routes, Route } from "react-router-dom"

// pages import
import Home from "./pages/Home"
import About from "./pages/About"
import Product from "./pages/Product"


// component imports
import Header from "./components/Header"

function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/product" element={<Product/>} />
      </Routes>
      




    </>
  )
}

export default App
