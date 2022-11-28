import styled from '@emotion/styled'

const Header = styled.header`
  background-color: #333;
  color: #fff;
  width: 100%;
  height: 50px;
`

const PageHeader = () => {
  return (
    <Header>
      <h1>Task Tracker</h1>
    </Header>
  )
}

export default PageHeader
