import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router'
import {
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  FormControl,
  FormLabel,
  InputRightElement,
  Link as ChakraLink,
} from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'

interface FormValues {
  username: string
  password: string
}

const Login = () => {
  const { login, isLogout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLogout) {
      navigate('/')
    }
  }, [isLogout, navigate, user])

  const [show, setShow] = useState(false)
  const handlePasswordShow = useCallback(() => setShow(!show), [show])

  const [loginForm, setLoginForm] = useState<FormValues>({
    username: '',
    password: '',
  })
  const handleFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setLoginForm({ ...loginForm, [name]: value })
    },
    [loginForm]
  )

  const handleLogin = useCallback(async () => {
    await login(loginForm.username, loginForm.password)
  }, [login, loginForm.password, loginForm.username])
  return (
    <PageContainer>
      <Heading>Login</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>ユーザー名</FormLabel>
          <InputGroup>
            <Input
              name="username"
              onChange={handleFormChange}
              placeholder="Username"
              value={loginForm.username}
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>パスワード</FormLabel>
          <InputGroup>
            <Input
              name="password"
              onChange={handleFormChange}
              placeholder="Password"
              type={show ? 'text' : 'password'}
              value={loginForm.password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" onClick={handlePasswordShow} size="sm">
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <Button onClick={handleLogin}>ログイン</Button>
        </FormControl>
        <ChakraLink as={Link} color="teal.500" to="/register">
          アカウントを新規作成する
        </ChakraLink>
      </Stack>
    </PageContainer>
  )
}

export default Login
