import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Heading, Divider } from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'

import UserEdit from './UserEdit'

const User = () => {
  const { logout, isLogout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLogout) {
      navigate('/login')
    }
  }, [isLogout, navigate])
  return (
    <PageContainer>
      <Heading>マイページ</Heading>
      <UserEdit />
      <Divider />
      <Heading size="sm">ログアウト</Heading>
      <Button onClick={logout}>Logout</Button>
    </PageContainer>
  )
}

export default User
