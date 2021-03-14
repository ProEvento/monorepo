import Page from '@components/page'
import { UserContext } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';

const Home = ({ userContext }: { userContext: UserContext}) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"Dashboard"} title={user ? `Welcome, ${user.name}!` : "Welcome!"} userContext={userContext}>
      
    </Page>
  )
}

export default withUserProp(Home)
