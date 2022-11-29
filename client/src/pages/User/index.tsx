import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  Stack,
  StackDivider,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'

import { useSWRConfig } from 'swr'

import UserEdit from './UserEdit'

import api from '/@/libs/apis'

const User = () => {
  const { mutate } = useSWRConfig()
  const { logout, isLogout, user } = useAuth()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const handleButtonDelete = useCallback(async () => {
    onOpen()
  }, [onOpen])

  const [password, setPassword] = useState('')
  const [isDelete, setIsDelete] = useState(false)
  const handleDeleteFix = useCallback(async () => {
    onClose()
    const res = await api.users.deleteUser({ password })
    if (res.status === 204) {
      setIsDelete(true)
      mutate('/users/me', undefined)
      navigate('/register')
    }
  }, [mutate, navigate, onClose, password])
  const handleDeleteCancel = useCallback(() => {
    onClose()
    setIsDelete(false)
    setPassword('')
  }, [onClose])
  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
    },
    []
  )

  useEffect(() => {
    console.log(isLogout)
    if (isLogout) {
      if (isDelete) {
        navigate('/register')
      }
      navigate('/login')
    }
  }, [isDelete, isLogout, navigate, user])

  return (
    <>
      <PageContainer>
        <Heading mb="8" size="2xl">
          マイページ
        </Heading>
        <VStack align="stretch" divider={<StackDivider />} spacing={4}>
          <UserEdit />
          <Stack align="start">
            <Heading size="md">ログアウト</Heading>
            <Button onClick={logout} w="100px">
              Logout
            </Button>
          </Stack>
          <Stack align="start">
            <Heading size="md">退会</Heading>
            <Button colorScheme="red" onClick={handleButtonDelete} w="100px">
              退会
            </Button>
          </Stack>
        </VStack>
      </PageContainer>
      <AlertDialog
        isOpen={isOpen}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        leastDestructiveRef={cancelRef as any}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>本当にアカウントを削除しますか？</Text>
              <FormControl isRequired>
                <FormLabel>パスワード</FormLabel>
                <Input
                  onChange={handlePasswordChange}
                  placeholder="パスワード"
                  value={password}
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel} w="110px">
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={handleDeleteFix}
                w="100px"
              >
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default User
