import Page from '@components/page'
import { UserContext, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';

const Profile = ({ userContext }: { userContext: UserContext }) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"Profile"} title={user.name}>
      
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Profile))
