import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '/@/libs/auth'

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
