import './App.css';
import { createBrowserRouter ,RouterProvider  } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/Auth/Login";
import Layout from "./pages/Layout";
import Movies from "./pages/user/Movies";
import ContactUs from "./pages/user/ContactUs";
import History from "./pages/user/History";
import Admin from "./pages/admin/Admin";
import EditMovies from "./pages/admin/EditMovies";


import "./i18n";
import EditMovies from "./pages/admin/EditMovies";

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
        },{
          path:"/admin",
          element:<Admin/>
        },{
<<<<<<< HEAD
          path:"/admin/movie/edit/:id",
=======
          path:"/edit-movies",
>>>>>>> 501a7f7269eccfdde5d15032a1e23b3009f8545a
          element:<EditMovies/>
        }

      ]
    }
  ]);

   return (
    <RouterProvider router={router} />
  );

 
}

export default App;
