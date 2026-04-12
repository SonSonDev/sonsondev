import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import Posts from './pages/Posts/Posts'
import Post from './pages/Post/Post'
import Admin from './pages/Admin/Admin'
import AdminPosts from './pages/Admin/Posts/Posts'
import NewPost from './pages/Admin/PostForm/NewPost'
import EditPost from './pages/Admin/PostForm/EditPost'
import Login from './pages/Login/Login'
import { usePageTracking } from './hooks/usePageTracking'
import { routes } from './routes'
import './styles/App.scss'

function AppRoutes() {
  usePageTracking()
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path={routes.Home} element={<Home />} />
          <Route path={routes.Posts} element={<Posts />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path={routes.Login} element={<Login />} />
          <Route
            path={routes.Admin}
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPosts />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<NewPost />} />
            <Route path="posts/:id/edit" element={<EditPost />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default function App () {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
