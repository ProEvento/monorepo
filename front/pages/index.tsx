import Page from '@components/page'
import { useUser } from '@auth0/nextjs-auth0';

const Home = () => {
  const { user, error, isLoading } = useUser();  
  return (
    <Page header={false}>
      Welcome
      {isLoading && <div>Loading</div>}
      {error && <div>Error</div>}
      {user && <div>Welcome {user.name}! <a href="/api/auth/logout">Logout</a></div>}
      {!user && !error && !isLoading && <a href="/api/auth/login">Login</a>}
    </Page>
  )
}

export default Home