import React from 'react'
import { useAuth } from '/@/libs/auth'
import { Navigate } from 'react-router-dom'

interface Props {
  component: React.ReactNode
}

const RouteAuthGuard = (props: Props) => {
  const { user, isLogout } = useAuth()
  console.log(user)
  console.log(isLogout)

  if (user === null) {
    return <Navigate to="/login" replace={false} />
  }

  return <>{props.component}</>
}

export default RouteAuthGuard
