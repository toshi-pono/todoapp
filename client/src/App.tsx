import AppRoutes from '/@/routes'

import PageHeader from './components/layouts/PageHeader'
import { AppProviders } from './providers/app'

function App() {
  return (
    <AppProviders>
      <PageHeader />
      <AppRoutes />
    </AppProviders>
  )
}

export default App
