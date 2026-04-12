import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import Post from './pages/Post/Post'
import Admin from './pages/Admin/Admin'
import Articles from './pages/Admin/Articles/Articles'
import NewArticle from './pages/Admin/NewArticle/NewArticle'
import EditArticle from './pages/Admin/EditArticle/EditArticle'
import Login from './pages/Login/Login'
import { usePageTracking } from './hooks/usePageTracking'
import './styles/App.scss'

function AppRoutes() {
  usePageTracking()
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<Articles />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/new" element={<NewArticle />} />
            <Route path="articles/:id/edit" element={<EditArticle />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default function App () {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
