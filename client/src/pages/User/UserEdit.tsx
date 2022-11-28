import { useEffect, useState, useCallback, ChangeEvent } from 'react'

import {
  Button,
  FormControl,
  InputGroup,
  Input,
  FormLabel,
  InputRightElement,
  Divider,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { useSWRConfig } from 'swr'

import { useAuth } from '/@/libs/auth'
import api from '/@/libs/apis'

interface PasswordEditForm {
  password: string
  newPassword: string
}

const UserEdit = () => {
  const { user } = useAuth()
  const { mutate } = useSWRConfig()
  const toast = useToast()

  const [passwordForm, setPasswordForm] = useState<PasswordEditForm>({
    password: '',
    newPassword: '',
  })
  const [nameForm, setNameForm] = useState<string>('')
  const [show, setShow] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const handlePasswordShow = useCallback(() => setShow(!show), [show])
  const handleNewPasswordShow = useCallback(
    () => setShowNew(!showNew),
    [showNew]
  )

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setPasswordForm({
        ...passwordForm,
        [name]: value,
      })
    },
    [passwordForm]
  )
  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNameForm(e.target.value)
  }, [])

  const handleUpdateName = useCallback(async () => {
    try {
      const res = await api.users.updateMe({ name: nameForm })
      if (res.status === 200) {
        mutate('/users/me')
        toast({
          title: 'ユーザー名を更新しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (e) {
      const err = e as AxiosError
      if (err.response?.status === 409) {
        toast({
          title: 'ユーザー名が重複しています',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'ユーザー名の更新に失敗しました',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }, [nameForm, mutate, toast])

  const handleUpdatePassword = useCallback(async () => {
    try {
      const res = await api.users.updatePassword(passwordForm)
      if (res.status === 200) {
        mutate('/users/me')
        toast({
          title: 'パスワードを更新しました',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (e) {
      const error = e as AxiosError
      if (error.response?.status === 403) {
        toast({
          title: 'パスワードが間違っています',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw e
      }
    }
  }, [passwordForm, mutate])

  useEffect(() => {
    if (user !== undefined) {
      setNameForm(user.name)
    }
  }, [user])

  return (
    <Stack>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <InputGroup>
          <Input
            name="username"
            onChange={handleNameChange}
            placeholder="Username"
            value={nameForm}
          />
        </InputGroup>
        <Button mt="2" onClick={handleUpdateName}>
          更新する
        </Button>
      </FormControl>
      <Divider mx="10" />
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            onChange={handlePasswordChange}
            placeholder="Password"
            type={show ? 'text' : 'password'}
            value={passwordForm.password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" onClick={handlePasswordShow} size="sm">
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel>New Password</FormLabel>
        <InputGroup>
          <Input
            name="newPassword"
            onChange={handlePasswordChange}
            placeholder="new Password"
            type={showNew ? 'text' : 'password'}
            value={passwordForm.newPassword}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" onClick={handleNewPasswordShow} size="sm">
              {showNew ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button mt="2" onClick={handleUpdatePassword}>
          更新する
        </Button>
      </FormControl>
    </Stack>
  )
}

export default UserEdit
