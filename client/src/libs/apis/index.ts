import { AuthApi, Configuration, TasksApi, UsersApi } from './generated'

const config = new Configuration({ basePath: '/api' })
const api = {
  auth: new AuthApi(config),
  tasks: new TasksApi(config),
  users: new UsersApi(config),
}

export default api
export * from './generated'
