import Page from '@components/page'
import { UserContext, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';

const Explore = ({ userContext }: { userContext: UserContext }) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"Explore"} title={"Explore"} userContext={userContext}>
      
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Explore))
