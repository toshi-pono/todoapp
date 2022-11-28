import { Routes, Route } from 'react-router-dom'

import RouteAuthGuard from '/@/components/RouteAuthGuard'
import Home from '/@/pages/Home'
import Login from '/@/pages/Login'
import Task from '/@/pages/Task'
import TaskCreate from '/@/pages/TaskCreate'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RouteAuthGuard component={<Home />} />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route
        element={<RouteAuthGuard component={<Task />} />}
        path="/task/:taskId"
      />
      <Route
        element={<RouteAuthGuard component={<TaskCreate />} />}
        path="/task/create"
      />
    </Routes>
  )
}

export default AppRoutes
