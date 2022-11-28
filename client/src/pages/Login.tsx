import { useAuth } from '/@/libs/auth'

const Login = () => {
  const { login } = useAuth()
  return (
    <div>
      Login
      <button onClick={() => login('toshi00', 'password')}>Login</button>
    </div>
  )
}

export default Login
