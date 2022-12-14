import { AxiosError } from 'axios'
import useSWR from 'swr'

import api, { User } from '/@/libs/apis'

export const useAuth = () => {
  const fetcher = () => api.users.getMe().then((res) => res.data)
  const {
    data: user,
    mutate,
    error,
  } = useSWR<User, AxiosError>('/users/me', fetcher)

  const login = async (name: string, password: string) => {
    const res = await api.auth.login({
      name,
      password,
    })
    if (res.status === 204) {
      mutate()
    }
  }

  const logout = async () => {
    await api.auth.logout()
    mutate(undefined)
  }

  const isLogout = user === undefined && error?.response?.status === 401

  return {
    user,
    isLogout,
    login,
    logout,
  }
}
