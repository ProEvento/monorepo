import Page from '@components/page'
import { UserContext, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';

const Events = ({ userContext }: { userContext: UserContext}) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"My Events"} title={user ? `Welcome, ${user.name}!` : "Welcome!"} userContext={userContext}>
      
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Events))
