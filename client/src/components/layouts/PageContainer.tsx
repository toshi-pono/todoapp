import { ReactNode } from 'react'

import styled from '@emotion/styled'

const Container = styled.main`
  width: 100%;
  max-width: 1024px;
`

interface Props {
  children: ReactNode
}

const PageContainer = ({ children }: Props) => {
  return <Container>{children}</Container>
}

export default PageContainer
