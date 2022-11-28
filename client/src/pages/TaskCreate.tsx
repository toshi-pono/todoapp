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
} from '@chakra-ui/react'

import PageContainer from '/@/components/layouts/PageContainer'
import api from '/@/libs/apis'

interface TaskForm {
  title: string
  description: string
}

const TaskCreate = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
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

  const handleSubmit = useCallback(async () => {
    const res = await api.tasks.createTask(form)
    if (res.status === 201) {
      setForm({
        title: '',
        description: '',
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
      <Heading mb="4">Create Task</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>タイトル</FormLabel>
          <Input
            name="title"
            onChange={handleFormChange}
            placeholder="Title"
            value={form.title}
          />
        </FormControl>
        <FormControl>
          <FormLabel>説明</FormLabel>
          <Input
            name="description"
            onChange={handleFormChange}
            placeholder="Description"
            value={form.description}
          />
        </FormControl>
        <Flex>
          <Spacer />
          <Button onClick={handleSubmit}>作成</Button>
        </Flex>
      </Stack>
    </PageContainer>
  )
}

export default TaskCreate
