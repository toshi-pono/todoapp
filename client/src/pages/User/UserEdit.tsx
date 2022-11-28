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
} from '@chakra-ui/react'

import { useAuth } from '/@/libs/auth'
import api from '/@/libs/apis'

interface PasswordEditForm {
  password: string
  newPassword: string
}

const UserEdit = () => {
  const { user } = useAuth()
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
    const res = await api.users.updateMe({ name: nameForm })
    if (res.status === 200) {
      // TODO: alertをかっこよくする
      alert('ユーザー名を更新しました')
    }
  }, [nameForm])

  const handleUpdatePassword = useCallback(async () => {
    const res = await api.users.updatePassword(passwordForm)
    if (res.status === 200) {
      // TODO: alertをかっこよくする
      alert('パスワードを更新しました')
    }
  }, [passwordForm])

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
