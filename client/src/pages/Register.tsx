import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
import { useNavigate } from 'react-router'

import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'

import api from '../libs/apis'

interface FormValues {
  username: string
  password: string
}

const Register = () => {
  const { isLogout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLogout) {
      navigate('/')
    }
  }, [isLogout, navigate, user])

  const [show, setShow] = useState(false)
  const handlePasswordShow = useCallback(() => setShow(!show), [show])

  const [registerForm, setRegisterForm] = useState<FormValues>({
    username: '',
    password: '',
  })
  const handleFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setRegisterForm((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleRegister = useCallback(async () => {
    try {
      const res = await api.users.createUser({
        name: registerForm.username,
        password: registerForm.password,
      })
      if (res.status === 201) {
        navigate('/login')
      }
    } catch (e) {
      console.log(e)
    }
  }, [navigate, registerForm.password, registerForm.username])
  return (
    <PageContainer>
      <Heading>Register</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>ユーザー名</FormLabel>
          <InputGroup>
            <Input
              name="username"
              onChange={handleFormChange}
              placeholder="Username"
              value={registerForm.username}
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
              value={registerForm.password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" onClick={handlePasswordShow} size="sm">
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <Button onClick={handleRegister}>新規登録</Button>
        </FormControl>
        <ChakraLink as={Link} color="teal.500" to="/login">
          アカウントをお持ちの方はこちら
        </ChakraLink>
      </Stack>
    </PageContainer>
  )
}

export default Register
