import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';

const Profile = ({ userContext }: { userContext: CustomUserContext }) => {
  const { user, error, isLoading } = userContext;  
  if (isLoading) {
    return <></>
  }

  console.log(user)

  return (
    <Page header={false} activePage={"Profile"} title={user.firstName} userContext={userContext}>
      
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Profile))
