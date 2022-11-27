import { AppProviders } from './providers/app'
import AppRoutes from '/@/routes'

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
