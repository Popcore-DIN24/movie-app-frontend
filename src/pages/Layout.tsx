import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import Footer from "../components/Footer"


export default function Layout() {
  return (
    <>
    <div>
      <Navbar />
      <main>
        {/* Main content goes here */
        <Outlet/>}
      </main>
      <Footer />
    </div>
    </>
  )
}
