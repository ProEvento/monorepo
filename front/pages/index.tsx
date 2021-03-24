import Page from '@components/page'
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';

const Home = ({ userContext }: { userContext: CustomUserContext}) => {
  // Not logged in
  if (!userContext.user) {
    return (
      <Page header={false} activePage={"Dashboard"} title={`Welcome!`} userContext={userContext}>
      </Page>
    )
  }

  const { user, error, isLoading } = userContext;

  return (
    <Page header={false} activePage={"Dashboard"} title={`Welcome, ${user.firstName}!`} userContext={userContext}>
    </Page>
  )
}

export default withUserProp(Home)
