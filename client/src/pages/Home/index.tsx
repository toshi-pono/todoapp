import { Link } from 'react-router-dom'

import {
  Stack,
  Heading,
  Spacer,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from '@chakra-ui/react'

import TaskListComponent from './TaskList'

import PageContainer from '/@/components/layouts/PageContainer'

const Home = () => {
  return (
    <PageContainer>
      <Breadcrumb>
        <BreadcrumbItem isCurrentPage>
          <Link to="/">TaskList</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stack spacing={4}>
        <Heading>TaskList</Heading>
        <Flex>
          <Spacer />
          <Button as={Link} colorScheme="teal" to="/tasks/new">
            新規作成
          </Button>
        </Flex>
        <TaskListComponent />
      </Stack>
    </PageContainer>
  )
}

export default Home
