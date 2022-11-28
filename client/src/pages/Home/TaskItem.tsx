import { Link } from 'react-router-dom'

import { Flex, Checkbox, IconButton, Spacer } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import { Task } from '/@/libs/apis'

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
        <Link to={`/tasks/${task.id}`}>
          <div>{task.title}</div>
          <div>{task.description}</div>
        </Link>
        <Spacer />
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
