import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
  AvatarGroup,
  Avatar,
  Divider,
  FormErrorMessage,
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Stack,
  Flex,
  StackDivider,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { useParams } from 'react-router'
import useSWR from 'swr'

import api, { TaskDetail, UpdateTaskRequest } from '/@/libs/apis'
import PageContainer from '/@/components/layouts/PageContainer'
import { useAuth } from '/@/libs/auth'
import { toFormDate } from '/@/libs/date'

const TaskDetailPage = () => {
  const { user } = useAuth()
  const { taskId } = useParams<{ taskId: string }>()
  const fetcher = (_: string, id: string) =>
    api.tasks.getTask(id).then((res) => res.data)
  const { data: task, mutate } = useSWR<TaskDetail, AxiosError>(
    ['/tasks/', taskId],
    fetcher
  )

  const [form, setForm] = useState<UpdateTaskRequest>({
    title: '',
    description: '',
    done: false,
    priority: 2,
    deadline: '',
  })
  const handleFormInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }))
    },
    []
  )
  const handleFormDoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        done: e.target.checked,
      }))
    },
    []
  )
  const handleFormPriorityChange = useCallback((val: number) => {
    setForm((prev) => ({
      ...prev,
      priority: val,
    }))
  }, [])

  const [shareUser, setShareUser] = useState('')
  const [shareErrorMessage, setShareErrorMessage] = useState('')
  const handleShareUserChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShareUser(e.target.value)
    },
    []
  )
  const handleShare = useCallback(async () => {
    if (taskId === undefined || shareUser === '') return
    try {
      const res = await api.tasks.shareTask(taskId, {
        name: shareUser,
      })
      if (res.status === 204) {
        setShareUser('')
        setShareErrorMessage('')
        mutate()
      }
    } catch (e) {
      const err = e as AxiosError
      if (err.response?.status === 409) {
        setShareErrorMessage('すでに共有されています')
      } else if (err.response?.status === 400) {
        setShareErrorMessage('ユーザーが見つかりません')
      } else {
        setShareErrorMessage('エラーが発生しました')
      }
    }
  }, [shareUser, taskId, mutate])

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        done: task.done,
        priority: task.priority,
        deadline: toFormDate(new Date(task.deadline)),
      })
    }
  }, [task])

  const handleUpdateTask = useCallback(async () => {
    if (task === undefined) return
    const res = await api.tasks.updateTask(task?.id, {
      title: form.title,
      description: form.description,
      done: form.done,
      priority: form.priority,
      deadline: new Date(form.deadline).toISOString(),
    })
    if (res.status === 200) {
      mutate()
    }
  }, [
    form.deadline,
    form.description,
    form.done,
    form.priority,
    form.title,
    mutate,
    task,
  ])

  if (!task) {
    return <PageContainer>Loading...</PageContainer>
  }

  return (
    <PageContainer>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/">TaskList</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link to="#">TaskDetail</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading mb="8" size="2xl">
        Task Detail
      </Heading>
      <VStack align="stretch" divider={<StackDivider />} spacing="4">
        <Stack>
          <Heading size="md">タスクの編集</Heading>
          <FormControl>
            <FormLabel mb="0">タイトル</FormLabel>
            <Input
              name="title"
              onChange={handleFormInputChange}
              placeholder="タイトル"
              value={form.title}
            />
          </FormControl>
          <FormControl>
            <FormLabel mb="0">説明</FormLabel>
            <Input
              name="description"
              onChange={handleFormInputChange}
              placeholder="説明"
              value={form.description}
            />
          </FormControl>
          <FormControl>
            <FormLabel mb="0">期限</FormLabel>
            <Input
              name="deadline"
              onChange={handleFormInputChange}
              placeholder="締め切り"
              type="datetime-local"
              value={form.deadline}
            />
          </FormControl>
          <FormControl>
            <FormLabel mb="3">優先度：{form.priority + 1} / 5</FormLabel>
            <Box px="5">
              <Slider
                defaultValue={2}
                max={4}
                min={0}
                onChange={handleFormPriorityChange}
                step={1}
                value={form.priority}
              >
                <SliderTrack bg="teal.100">
                  <Box position="relative" right={10} />
                  <SliderFilledTrack bg="teal.500" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
          </FormControl>
          <FormControl>
            <FormLabel>完了</FormLabel>
            <Checkbox isChecked={form.done} onChange={handleFormDoneChange} />
          </FormControl>
          <Flex justifyContent="right">
            <Button onClick={handleUpdateTask} w="100px">
              更新
            </Button>
          </Flex>
        </Stack>
        <Stack>
          <Heading size="md">共有</Heading>
          <AvatarGroup max={2} size="md">
            {task.shareList
              .filter((share) => share.id !== user?.id)
              .map((share) => (
                <Avatar key={share.id} name={share.name} />
              ))}
          </AvatarGroup>
          <FormControl isInvalid={shareErrorMessage !== ''}>
            <FormLabel>共有するユーザー名</FormLabel>
            <Input
              name="shareUserName"
              onChange={handleShareUserChange}
              placeholder="ユーザー名"
              value={shareUser}
            />
            {shareErrorMessage !== '' && (
              <FormErrorMessage>{shareErrorMessage}</FormErrorMessage>
            )}
          </FormControl>
          <Flex justifyContent="right">
            <Button onClick={handleShare} w="100px">
              共有
            </Button>
          </Flex>
        </Stack>
      </VStack>
    </PageContainer>
  )
}

export default TaskDetailPage
