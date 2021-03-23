import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';

const Explore = ({ userContext }: { userContext: CustomUserContext }) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"Explore"} title={"Explore"} userContext={userContext}>
      
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Explore))
