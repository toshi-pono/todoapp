import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '/@/libs/auth'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <BrowserRouter>
          <ChakraProvider>{children}</ChakraProvider>
        </BrowserRouter>
      </AuthProvider>
    </React.Suspense>
  )
}
