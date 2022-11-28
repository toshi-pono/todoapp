import { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import useSWR from 'swr'
import api, { User } from '/@/libs/apis'

interface AuthContextData {
  user: User | null
  isLogout: boolean
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)
export const useAuth = (): AuthContextData => {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
  const fetcher = () =>
    api.users.getMe().then((res) => {
      console.log(res.data)
      return res.data
    })
  const { data, mutate, error } = useSWR('/users/me', fetcher)

  const login = async (name: string, password: string) => {
    const res = await api.auth.login({ name, password })
    if (res.status === 204) {
      mutate()
    }
  }

  const isLogout = !data && error?.status === 403

  const logout = async () => {
    await api.auth.logout()
    mutate()
  }

  const value: AuthContextData = { user: data ?? null, login, logout, isLogout }
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}
