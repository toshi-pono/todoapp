import { Link } from 'react-router-dom'

import { Avatar, Flex, Spacer, Box, Heading } from '@chakra-ui/react'

import { useAuth } from '/@/libs/auth'

const PageHeader = () => {
  const { user, isLogout } = useAuth()
  return (
    <header>
      <Flex alignItems="center" backgroundColor="#ccc" gap="2" p="2">
        <Box p="2">
          <Link to="/">
            <Heading size="md">Task Tracker</Heading>
          </Link>
        </Box>

        {user && !isLogout && (
          <>
            <Spacer />
            <Link to="/mypage">
              <Avatar name={user.name} size="md" />
            </Link>
          </>
        )}
      </Flex>
    </header>
  )
}

export default PageHeader
