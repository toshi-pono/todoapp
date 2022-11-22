import { useRouteData } from 'solid-start'
import { Title } from 'solid-start'
import { createServerData$, redirect } from 'solid-start/server'
import { getCookie } from '/@/scripts/session'
import api from '/@/utils/apis'
import Counter from '/@/components/Counter'

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const cookie = await getCookie(request)
    if (!cookie) {
      throw redirect('/login')
    }

    try {
      const res = await api.users.getMe({
        headers: {
          Cookie: cookie,
        },
      })
      if (res.status !== 200) {
        throw redirect('/login')
      }
      return res.data
    } catch (err) {
      console.log(err)
      throw redirect('/login')
    }
  })
}

const Home = () => {
  const user = useRouteData<typeof routeData>()
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <p>Welcome, {user()?.name}!</p>
      <Counter />
    </main>
  )
}

export default Home
