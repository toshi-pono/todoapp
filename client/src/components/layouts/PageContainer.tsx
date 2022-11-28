import { ReactNode } from 'react'

import styled from '@emotion/styled'

const Container = styled.main`
  width: 100%;
  max-width: 896px;
  padding: 16px;
  margin: 0 auto;
`

interface Props {
  children: ReactNode
}

const PageContainer = ({ children }: Props) => {
  return <Container>{children}</Container>
}

export default PageContainer
