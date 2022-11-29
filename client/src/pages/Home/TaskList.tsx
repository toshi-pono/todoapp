import { useCallback, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Stack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import useSWR from 'swr'

import api, { TaskList, Task } from '/@/libs/apis'

import SearchForm, { SearchArgs } from './SearchForm'
import TaskItem from './TaskItem'

interface TaskArgs {
  limit?: number
  offset?: number
  keyword?: string
  done?: string
}

const MAX_ENTRIES = 10

const TaskListComponent = () => {
  const [taskArgs, setTaskArgs] = useState<TaskArgs>({
    limit: MAX_ENTRIES,
    offset: 0,
  })
  const [page, setPage] = useState(1)

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
  const { data: tasks, mutate } = useSWR<TaskList, AxiosError>(
    { url: '/tasks', args: taskArgs },
    tasksFetcher
  )
  const handlePageChange = useCallback(
    (shift: number) => {
      if (tasks === undefined) return
      setPage((prev) => {
        const newPage = prev + shift
        if (newPage < 1) return 1
        if (newPage > Math.ceil(tasks?.total / MAX_ENTRIES)) return prev
        return newPage
      })
      setTaskArgs((prev) => ({
        ...prev,
        offset: (page + shift - 1) * MAX_ENTRIES,
      }))
    },
    [page, tasks]
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
      <Flex>
        <Text mr="2">
          {tasks.tasks.length}/{tasks.total}件 ({page}ページ目)
        </Text>
        <Divider orientation="vertical" />
        {tasks.total > MAX_ENTRIES && (
          <Box ml="2">
            <IconButton
              aria-label="前のページ"
              icon={<ChevronLeftIcon />}
              mr="1"
              onClick={() => handlePageChange(-1)}
              size="sm"
            />
            <IconButton
              aria-label="次のページ"
              icon={<ChevronRightIcon />}
              onClick={() => handlePageChange(1)}
              size="sm"
            />
          </Box>
        )}
      </Flex>

      <Divider />
      <VStack divider={<StackDivider />} spacing={4}>
        {tasks.tasks.map((task) => (
          <TaskItem
            deleteHandler={handleDeleteTask}
            key={task.id}
            task={task}
            toggleHandler={handleToggleTask}
          />
        ))}
      </VStack>
      <Divider />
    </Stack>
  )
}

export default TaskListComponent
