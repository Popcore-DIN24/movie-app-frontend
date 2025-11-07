import { createBrowserRouter ,RouterProvider  } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/Auth/Login";
<<<<<<< HEAD
import Layout from "./pages/Layout";
import Movies from "./pages/user/Movies";
import ContactUs from "./pages/user/ContactUs";
import History from "./pages/user/History";

=======
import Navbar from "./components/navbar/Navbar";
import "./i18n";
>>>>>>> f9cff9404659c83553334ce5d6a277b6b29bda5c

function App() {
   const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/login",
          element: <Login/>
        },{
          path:"/movies",
          element:<Movies/>
        },{
          path:"/contactus",
          element:<ContactUs/>
        },{
          path:"/history",
          element:<History/>
        }
      ]
    }
  ]);

   return (
    <RouterProvider router={router} />
  );

 
}

export default App;
