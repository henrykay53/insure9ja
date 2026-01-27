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
      


      <div className='flex justify-center mt-10 bg-green-500 hover:bg-green-300 p-10 w-1.5 mx-auto'>Hello</div>

    </>
  )
}

export default App
