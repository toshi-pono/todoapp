import React from 'react'
import { useAuth } from '/@/libs/auth'
import { Navigate } from 'react-router-dom'

interface Props {
  component: React.ReactNode
}

const RouteAuthGuard = (props: Props) => {
  const { isLogout } = useAuth()

  if (isLogout) {
    return <Navigate to="/login" replace={false} />
  }

  return <>{props.component}</>
}

export default RouteAuthGuard
