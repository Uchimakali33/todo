import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from "./login.jsx"
import Register from './register.jsx'
import Create from "./create.jsx"
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom'
import Home from './Home.jsx'
import ProtectedLayout from './ProtectedLayout.jsx'



const router=createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    element:<ProtectedLayout/>,
    children:[
      {
        path:"/create",
        element:<Create/>
      },
    ],
  },
  {
    path:"*",
    element:<Navigate to={"/login"}/>,
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
