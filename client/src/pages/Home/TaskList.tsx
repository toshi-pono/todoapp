import { Fragment, useCallback } from 'react'

import { Divider, Stack } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import useSWR from 'swr'

import api, { Task } from '/@/libs/apis'

import TaskItem from './TaskItem'

interface TaskArgs {
  limit?: number
  offset?: number
  keyword?: string
}

const TaskList = () => {
  const tasksFetcher = (request: { url: string; args: TaskArgs }) => {
    return api.tasks
      .getTasks(request.args.limit, request.args.offset, request.args.keyword)
      .then((res) => res.data)
  }
  const { data: tasks, mutate } = useSWR<Task[], AxiosError>(
    { url: '/tasks', args: { limit: 10, offset: 0, keyword: undefined } },
    tasksFetcher
  )

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        const res = await api.tasks.deleteTask(id)
        if (res.status === 204) {
          mutate()
        }
      } catch (e) {
        console.error(e)
      }
    },
    [mutate]
  )
  const handleToggleTask = useCallback(
    async (id: string, task: Task) => {
      try {
        task.done = !task.done
        const res = await api.tasks.updateTask(id, task)
        if (res.status === 200) {
          // TODO: 部分更新にする
          mutate()
        }
      } catch (e) {
        console.error(e)
      }
    },
    [mutate]
  )

  if (tasks === undefined) {
    return <div>Loading...</div>
  }

  return (
    <Stack spacing={4}>
      <Divider />
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <TaskItem
            deleteHandler={handleDeleteTask}
            task={task}
            toggleHandler={handleToggleTask}
          />
          <Divider />
        </Fragment>
      ))}
    </Stack>
  )
}

export default TaskList
