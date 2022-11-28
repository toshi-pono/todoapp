import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <ChakraProvider>{children}</ChakraProvider>
      </BrowserRouter>
    </React.Suspense>
  )
}
