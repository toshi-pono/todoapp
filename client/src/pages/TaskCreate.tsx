import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Input,
  Button,
  Flex,
  Spacer,
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
      <Heading>Create Task</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            onChange={handleFormChange}
            placeholder="Title"
            value={form.title}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
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
