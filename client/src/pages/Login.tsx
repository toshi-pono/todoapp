import { ChangeEvent, useCallback, useState } from 'react'
import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputRightElement,
} from '@chakra-ui/react'

import { useAuth } from '/@/libs/auth'
import PageContainer from '/@/components/layouts/PageContainer'

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
            placeholder="Username"
            value={user.username}
            onChange={handleFormChange}
            name="username"
          />
        </InputGroup>
        <InputGroup>
          <Input
            placeholder="Password"
            value={user.password}
            onChange={handleFormChange}
            name="password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
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
