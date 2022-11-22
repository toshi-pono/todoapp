import { Show } from 'solid-js'
import { Title, useParams, useRouteData } from 'solid-start'
import { FormError } from 'solid-start/data'
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server'
import { createUserSession, login, getCookie } from '/@/scripts/session'
import api from '/@/utils/apis'

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const cookie = await getCookie(request)
    if (!cookie) {
      return {}
    }
    try {
      const res = await api.users.getMe({
        headers: {
          Cookie: cookie,
        },
      })
      if (res.status === 200) {
        // Already logged in, redirect to home
        throw redirect('/')
      }
      return {}
    } catch (err) {
      return {}
    }
  })
}

const Login = () => {
  const data = useRouteData<typeof routeData>()
  const params = useParams()
  const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
    const username = form.get('username')
    const password = form.get('password')
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new FormError('Invalid username or password')
    }

    // TODO: validate username and password
    const fields = { username, password }
    const setCookie = await login({ name: username, password })
    if (setCookie === null) {
      throw new FormError('Invalid username or password', {
        fields,
      })
    }
    return createUserSession(setCookie, '/')
  })

  return (
    <main>
      <Title>Login</Title>
      <h1>Login</h1>
      <Form>
        <input
          type="hidden"
          name="redirectTo"
          value={params.redirectTo ?? '/'}
        />
        <input type="text" name="username" />
        <input type="password" name="password" />
        <Show when={loggingIn.error}>
          <p>{loggingIn.error.message}</p>
        </Show>
        <button type="submit">{data() ? 'Login' : ''}</button>
      </Form>
    </main>
  )
}

export default Login
