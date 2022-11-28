import { Routes, Route } from 'react-router-dom'

import RouteAuthGuard from '/@/components/RouteAuthGuard'
import Home from '/@/pages/Home'
import Login from '/@/pages/Login'
import TaskDetailPage from '/@/pages/TaskDetailPage'
import TaskCreate from '/@/pages/TaskCreate'
import User from '/@/pages/User'
import Register from '/@/pages/Register'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RouteAuthGuard component={<Home />} />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route
        element={<RouteAuthGuard component={<TaskDetailPage />} />}
        path="/tasks/:taskId"
      />
      <Route
        element={<RouteAuthGuard component={<TaskCreate />} />}
        path="/tasks/new"
      />
      <Route element={<RouteAuthGuard component={<User />} />} path="/mypage" />
      <Route element={<Register />} path="/register" />
      <Route element={<RouteAuthGuard component={<Home />} />} path="*" />
    </Routes>
  )
}

export default AppRoutes
