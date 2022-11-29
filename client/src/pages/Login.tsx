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
  Flex,
  FormErrorMessage,
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

  const [errorMessage, setErrorMessage] = useState('')

  const [loginForm, setLoginForm] = useState<FormValues>({
    username: '',
    password: '',
  })
  const handleFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setLoginForm({ ...loginForm, [name]: value })
      setErrorMessage('')
    },
    [loginForm]
  )

  const handleLogin = useCallback(async () => {
    try {
      await login(loginForm.username, loginForm.password)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage('ログインできませんでした')
    }
  }, [login, loginForm.password, loginForm.username])
  return (
    <PageContainer>
      <Heading mb="8" size="2xl">
        Login
      </Heading>
      <Stack spacing={4}>
        <FormControl isInvalid={errorMessage !== ''} isRequired>
          <FormLabel mb="0">ユーザー名</FormLabel>
          <InputGroup>
            <Input
              name="username"
              onChange={handleFormChange}
              placeholder="Username"
              value={loginForm.username}
            />
          </InputGroup>
        </FormControl>
        <FormControl isInvalid={errorMessage !== ''} isRequired>
          <FormLabel mb="0">パスワード</FormLabel>
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
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
        <Flex justifyContent="center">
          <Button onClick={handleLogin} w="300px">
            ログイン
          </Button>
        </Flex>
        <ChakraLink
          as={Link}
          color="teal.500"
          textAlign="center"
          to="/register"
        >
          アカウントを新規作成する
        </ChakraLink>
      </Stack>
    </PageContainer>
  )
}

export default Login
