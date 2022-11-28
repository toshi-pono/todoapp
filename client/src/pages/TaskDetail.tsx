import { useCallback } from 'react'

import { AxiosError } from 'axios'
import { useParams } from 'react-router'
import useSWR from 'swr'

import api, { Task } from '/@/libs/apis'
import EditableInputPreview from '/@/components/ui/EditableInputPreview'
import PageContainer from '/@/components/layouts/PageContainer'

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const fetcher = (_: string, id: string) =>
    api.tasks.getTask(id).then((res) => res.data)
  const { data: task, mutate } = useSWR<Task, AxiosError>(
    ['/tasks/', taskId],
    fetcher
  )

  const onUpdate = useCallback((str: string) => {
    console.log(str)
  }, [])

  return (
    <PageContainer>
      <h1>Task Detail</h1>
      <EditableInputPreview onChange={onUpdate} value={task?.title ?? ''} />
    </PageContainer>
  )
}

export default TaskDetail
