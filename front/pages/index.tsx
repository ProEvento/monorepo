import Page from '@components/page'
import { useUser } from '@auth0/nextjs-auth0';

const Home = () => {
  const { user, error, isLoading } = useUser();  

  return (
    <Page header={false} activePage={"Dashboard"} title={user ? `Welcome, ${user.name}!` : "Welcome!"}>
      
    </Page>
  )
}

export default Home
