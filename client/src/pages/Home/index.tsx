import { Link } from 'react-router-dom'

import { Stack, Heading, Spacer, Flex } from '@chakra-ui/react'

import TaskList from './TaskList'

import PageContainer from '/@/components/layouts/PageContainer'

const Home = () => {
  return (
    <PageContainer>
      <Stack spacing={4}>
        <Heading>Tasks</Heading>
        <Flex>
          <Spacer />
          <Link to="/tasks/new">Create Task</Link>
        </Flex>
        <TaskList />
      </Stack>
    </PageContainer>
  )
}

export default Home
