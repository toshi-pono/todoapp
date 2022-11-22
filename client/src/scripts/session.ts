import { redirect } from 'solid-start'
import api from '../utils/apis'

// TODO: 今はただ横流ししているので、APIサーバーとのCookie/Tokenの適切なやり取りを調べたい

type LoginForm = {
  name: string
  password: string
}

export const login = async (form: LoginForm): Promise<string[] | null> => {
  try {
    const res = await api.auth.login(form)
    if (res.status === 204) {
      return res.headers['set-cookie'] ?? null
    }
  } catch (e) {
    return null
  }
  return null
}

export const logout = async () => {
  try {
    const res = await api.auth.logout()
    if (res.status === 204 && res.headers['set-cookie'] !== undefined) {
      return redirect('/login', {
        headers: {
          'Set-Cookie': res.headers['set-cookie'].join(';'),
        },
      })
    }
  } catch (e) {
    return null
  }
  return null
}

export const createUserSession = async (
  setCookie: string[],
  redirectTo: string
) => {
  // setCookie配列をCookieヘッダーに変換
  const cookie = setCookie.join(';')
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': cookie,
    },
  })
}

export const getCookie = async (request: Request): Promise<string | null> => {
  const cookie = request.headers.get('Cookie')
  if (cookie === null) {
    return null
  }
  return cookie
}
