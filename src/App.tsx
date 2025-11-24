import './App.css';
import { createBrowserRouter ,RouterProvider  } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/Auth/Login";
import Layout from "./pages/Layout";
import Movies from "./pages/user/Movies";
import ContactUs from "./pages/user/ContactUs";
import History from "./pages/user/History";
import MovieDetails from "./pages/user/MovieDetails";



import "./i18n";


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
          path:"/movie/:id"
          ,element:<MovieDetails/>
        }

      ]
    }
  ]);

   return (
    <RouterProvider router={router} />
  );

 
}

export default App;
