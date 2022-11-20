import { AuthApi, TasksApi, UsersApi } from '/@/utils/apis/generated'

const api = {
  auth: new AuthApi(),
  tasks: new TasksApi(),
  users: new UsersApi(),
}

export default api
export * from '/@/utils/apis/generated'
