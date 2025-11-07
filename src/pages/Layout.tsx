
import Navbar from "../components/navbar/Navbar"
import Footer from "../components/Footer"
import Home from "./user/Home"

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        {/* Main content goes here */
        <Home />}
      </main>
      <Footer />
    </div>
  )
}
