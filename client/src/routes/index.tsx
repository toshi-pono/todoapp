import { Routes, Route } from 'react-router-dom'

import Home from '/@/pages/Home'
import Login from '/@/pages/Login'
import Task from '/@/pages/Task'
import TaskCreate from '/@/pages/TaskCreate'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/task/:taskId" element={<Task />} />
      <Route path="/task/create" element={<TaskCreate />} />
    </Routes>
  )
}

export default AppRoutes
