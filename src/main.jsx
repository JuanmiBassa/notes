import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root.jsx'
import Error404 from './routes/Error404.jsx'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'
import Dashboard from './routes/Dashboard.jsx'
import Notes from './routes/Notes.jsx'
import CreateNote from './routes/CreateNote.jsx'
import DataNote from './routes/DataNote.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: <App />
      },
      {
        path: "error",
        element: <Error404 />
      },
      {
        path: "notes",
        element: <Notes />,
      },
      {
        path: "notes/:noteId",
        element: <DataNote />
      },
      {
        path: "createNote",
        element: <CreateNote />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)
