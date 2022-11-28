import { AppProviders } from './providers/app'
import AppRoutes from '/@/routes'

import PageHeader from './components/layouts/PageHeader'

function App() {
  return (
    <AppProviders>
      <PageHeader />
      <AppRoutes />
    </AppProviders>
  )
}

export default App
