import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Input,
  Button,
  Flex,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import api from '/@/libs/apis'
import { toFormDate } from '/@/libs/date'

interface TaskForm {
  title: string
  description: string
  priority: number
  deadline: string
}

const dDeadline = new Date()
dDeadline.setDate(dDeadline.getDate() + 1)
dDeadline.setHours(dDeadline.getHours() + 9)

const dtString = toFormDate(dDeadline)

const TaskCreate = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    priority: 2,
    deadline: dtString,
  })
  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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

  const handleSubmit = useCallback(async () => {
    const res = await api.tasks.createTask({
      title: form.title,
      description: form.description,
      priority: form.priority,
      deadline: new Date(form.deadline).toISOString(),
    })
    if (res.status === 201) {
      setForm({
        title: '',
        description: '',
        priority: 2,
        deadline: dtString,
      })
      // TODO: / or /tasks どちらが良いか考える
      navigate('/')
    }
  }, [form, navigate])

  return (
    <PageContainer>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/">TaskList</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link to="#">New</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading mb="8">Create Task</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel mb="0">タイトル</FormLabel>
          <Input
            name="title"
            onChange={handleFormChange}
            placeholder="Title"
            value={form.title}
          />
        </FormControl>
        <FormControl>
          <FormLabel mb="0">説明</FormLabel>
          <Input
            name="description"
            onChange={handleFormChange}
            placeholder="Description"
            value={form.description}
          />
        </FormControl>
        <FormControl>
          <FormLabel mb="0">期限</FormLabel>
          <Input
            name="deadline"
            onChange={handleFormChange}
            placeholder="締め切り"
            type="datetime-local"
            value={form.deadline}
          />
        </FormControl>
        <FormControl>
          <FormLabel>優先度： {form.priority + 1}/5</FormLabel>
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
        </FormControl>
        <Flex>
          <Spacer />
          <Button onClick={handleSubmit} w="100px">
            作成
          </Button>
        </Flex>
      </Stack>
    </PageContainer>
  )
}

export default TaskCreate
