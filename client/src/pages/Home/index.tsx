import { Link } from 'react-router-dom'

import { AddIcon } from '@chakra-ui/icons'
import {
  Stack,
  Heading,
  Spacer,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Text,
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
        <Heading mb="0" size="2xl">
          TaskList
        </Heading>
        <Flex>
          <Spacer />
          <Button as={Link} colorScheme="teal" to="/tasks/new">
            <Text mr="1">新規作成</Text> <AddIcon />
          </Button>
        </Flex>
        <TaskListComponent />
      </Stack>
    </PageContainer>
  )
}

export default Home
