import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useParams } from 'react-router'
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import useSWR from 'swr'

import api, { Task, UpdateTaskRequest } from '/@/libs/apis'
import PageContainer from '/@/components/layouts/PageContainer'

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const fetcher = (_: string, id: string) =>
    api.tasks.getTask(id).then((res) => res.data)
  const { data: task, mutate } = useSWR<Task, AxiosError>(
    ['/tasks/', taskId],
    fetcher
  )

  const [form, setForm] = useState<UpdateTaskRequest>({
    title: '',
    description: '',
    done: false,
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

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        done: task.done,
      })
    }
  }, [task])

  const handleUpdateTask = useCallback(async () => {
    if (task === undefined) return
    const res = await api.tasks.updateTask(task?.id, {
      title: form.title,
      description: form.description,
      done: form.done,
    })
    if (res.status === 200) {
      mutate()
    }
  }, [form.description, form.done, form.title, mutate, task])

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
      <Heading mb="4">Task Detail</Heading>
      <FormControl>
        <FormLabel>タイトル</FormLabel>
        <Input
          name="title"
          onChange={handleFormInputChange}
          placeholder="タイトル"
          value={form.title}
        />
      </FormControl>
      <FormControl>
        <FormLabel>説明</FormLabel>
        <Input
          name="description"
          onChange={handleFormInputChange}
          placeholder="説明"
          value={form.description}
        />
      </FormControl>
      <FormControl>
        <FormLabel>完了</FormLabel>
        <Checkbox isChecked={form.done} onChange={handleFormDoneChange} />
      </FormControl>
      <Button onClick={handleUpdateTask}>更新</Button>
    </PageContainer>
  )
}

export default TaskDetail
