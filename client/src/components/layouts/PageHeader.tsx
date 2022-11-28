import { Link } from 'react-router-dom'

import styled from '@emotion/styled'
import { Avatar, Flex, Spacer, Box, Heading } from '@chakra-ui/react'

import { useAuth } from '/@/libs/auth'

const Header = styled.header`
  background-color: #ddd;
`

const PageHeader = () => {
  const { user, isLogout } = useAuth()
  return (
    <Header>
      <Flex alignItems="center" gap="2" maxW="896px" mx="auto" p="2">
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
    </Header>
  )
}

export default PageHeader
