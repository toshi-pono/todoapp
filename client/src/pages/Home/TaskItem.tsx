import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Flex, Checkbox, IconButton, Box } from '@chakra-ui/react'
import { DeleteIcon, WarningIcon } from '@chakra-ui/icons'

import { Task } from '/@/libs/apis'
import { dateToView } from '/@/libs/date'

interface Props {
  task: Task
  deleteHandler: (id: string) => Promise<void>
  toggleHandler: (id: string, task: Task) => Promise<void>
}

const TaskItem = ({ task, toggleHandler, deleteHandler }: Props) => {
  const handleToggle = () => {
    toggleHandler(task.id, task)
  }
  const handleDelete = () => {
    deleteHandler(task.id)
  }

  const [isOutdated, setIsOutdated] = useState(false)
  useEffect(() => {
    const now = new Date()
    const deadline = new Date(task.deadline)
    if (deadline < now) {
      setIsOutdated(true)
    } else {
      setIsOutdated(false)
    }
  }, [task.deadline])
  return (
    <>
      <Flex>
        <Checkbox
          colorScheme="orange"
          isChecked={task.done}
          ml="2"
          mr="4"
          onChange={handleToggle}
          size="lg"
        />
        {task.priority >= 3 ? (
          <WarningIcon color="teal" mt="1" />
        ) : (
          <Box w="16px"></Box>
        )}
        <Box
          color={isOutdated ? 'red' : ''}
          fontWeight={isOutdated ? 'bold' : undefined}
          mx="2"
          w="100%"
        >
          <Link to={`/tasks/${task.id}`}>
            <div>{task.title}</div>
            <div>{dateToView(new Date(task.deadline))}</div>
          </Link>
        </Box>
        <IconButton
          aria-label="delete"
          icon={<DeleteIcon />}
          onClick={handleDelete}
        />
      </Flex>
    </>
  )
}

export default TaskItem
