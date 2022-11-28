import { Fragment, useCallback, useState } from 'react'

import { Divider, Stack } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import useSWR from 'swr'

import api, { Task } from '/@/libs/apis'

import SearchForm, { SearchArgs } from './SearchForm'
import TaskItem from './TaskItem'

interface TaskArgs {
  limit?: number
  offset?: number
  keyword?: string
  done?: string
}

const TaskList = () => {
  const [taskArgs, setTaskArgs] = useState<TaskArgs>({
    limit: 10,
    offset: 0,
  })

  const tasksFetcher = (request: { url: string; args: TaskArgs }) => {
    return api.tasks
      .getTasks(
        request.args.limit,
        request.args.offset,
        request.args.keyword,
        request.args.done
      )
      .then((res) => res.data)
  }
  const { data: tasks, mutate } = useSWR<Task[], AxiosError>(
    { url: '/tasks', args: taskArgs },
    tasksFetcher
  )

  const handleSearchChange = useCallback(
    (args: SearchArgs) => {
      setTaskArgs((prev) => ({
        ...prev,
        keyword: args.keyword,
        done: args.done,
      }))
      mutate()
    },
    [mutate]
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
      <SearchForm onChange={handleSearchChange} />
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
