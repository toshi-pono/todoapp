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
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
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
  const [errorMessage, setErrorMessage] = useState('')

  const [registerForm, setRegisterForm] = useState<FormValues>({
    username: '',
    password: '',
  })
  const handleFormChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      setRegisterForm((prev) => ({ ...prev, [name]: value }))
      setErrorMessage('')
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
        setErrorMessage('')
        navigate('/login')
      }
    } catch (e) {
      if ((e as AxiosError).response?.status === 409) {
        setErrorMessage('ユーザー名が重複しています')
      } else {
        setErrorMessage('エラーが発生しました')
      }
    }
  }, [navigate, registerForm.password, registerForm.username])

  return (
    <PageContainer>
      <Heading mb="8" size="2xl">
        Register
      </Heading>
      <Stack spacing={4}>
        <FormControl isInvalid={errorMessage !== ''} isRequired>
          <FormLabel mb="0">ユーザー名</FormLabel>
          <InputGroup>
            <Input
              name="username"
              onChange={handleFormChange}
              placeholder="Username"
              value={registerForm.username}
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
              value={registerForm.password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" onClick={handlePasswordShow} size="sm">
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errorMessage !== '' ? errorMessage : ''}
          </FormErrorMessage>
        </FormControl>
        <Flex justifyContent="center">
          <Button onClick={handleRegister} w="300px">
            新規登録
          </Button>
        </Flex>
        <ChakraLink as={Link} color="teal.500" textAlign="center" to="/login">
          アカウントをお持ちの方はこちら
        </ChakraLink>
      </Stack>
    </PageContainer>
  )
}

export default Register
