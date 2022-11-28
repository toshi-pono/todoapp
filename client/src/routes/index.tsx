import { Routes, Route } from 'react-router-dom'
import RouteAuthGuard from '/@/components/RouteAuthGuard'

import Home from '/@/pages/Home'
import Login from '/@/pages/Login'
import Task from '/@/pages/Task'
import TaskCreate from '/@/pages/TaskCreate'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RouteAuthGuard component={<Home />} />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/task/:taskId"
        element={<RouteAuthGuard component={<Task />} />}
      />
      <Route
        path="/task/create"
        element={<RouteAuthGuard component={<TaskCreate />} />}
      />
    </Routes>
  )
}

export default AppRoutes
