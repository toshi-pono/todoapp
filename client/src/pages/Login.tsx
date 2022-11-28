import { ChangeEvent, useCallback, useState } from 'react'

import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputRightElement,
} from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'

interface FormValues {
  username: string
  password: string
}

const Login = () => {
  const { login } = useAuth()

  const [show, setShow] = useState(false)
  const handlePasswordShow = useCallback(() => setShow(!show), [show])

  const [user, setUser] = useState<FormValues>({ username: '', password: '' })
  const handleFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setUser({ ...user, [name]: value })
    },
    [user]
  )

  const handleLogin = useCallback(async () => {
    await login(user.username, user.password)
  }, [login, user.password, user.username])
  return (
    <PageContainer>
      <Heading>Login</Heading>
      <Stack spacing={4}>
        <InputGroup>
          <Input
            name="username"
            onChange={handleFormChange}
            placeholder="Username"
            value={user.username}
          />
        </InputGroup>
        <InputGroup>
          <Input
            name="password"
            onChange={handleFormChange}
            placeholder="Password"
            value={user.password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" onClick={handlePasswordShow} size="sm">
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button onClick={handleLogin}>Login</Button>
      </Stack>
    </PageContainer>
  )
}

export default Login
