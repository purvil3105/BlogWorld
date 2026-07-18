import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { AuthLayout } from './components/index.js'
import Login from './pages/Login.jsx'
import AddPost from "./pages/AddPost";
import Signup from './pages/Signup'
import EditPost from "./pages/EditPost";

import Post from "./pages/Post";
import AllPosts from "./pages/AllPost";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import Bookmarks from "./pages/Bookmarks";
import About from "./pages/About";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Search from "./pages/Search";

  const router = createBrowserRouter([{
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: "login",
        element:(
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        )
      },
      {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AllPosts />
                </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <AddPost />
                </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <EditPost />
                </AuthLayout>
            ),
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
        {
            path: "/explore",
            element: <Explore />,
        },
        {
            path: "/search",
            element: <Search />,
        },
        {
            path: "/categories",
            element: <Categories />,
        },
        {
            path: "/bookmarks",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <Bookmarks />
                </AuthLayout>
            ),
        },
        {
            path: "/about",
            element: <About />,
        },
        {
            path: "/profile",
            element: (
                <AuthLayout authentication>
                    {" "}
                    <Profile />
                </AuthLayout>
            ),
        },
        {
            path: "/user/:userId",
            element: <PublicProfile />,
        },
    ]
  }])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
