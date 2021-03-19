import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import EventPage from '@components/events';

const Events = ({ userContext }: { userContext: CustomUserContext}) => {
  const { user, error, isLoading } = userContext;  

  return (
    <Page header={false} activePage={"My Events"} title={user ? `Welcome, ${user.name}!` : "Welcome!"} userContext={userContext}>
        <EventPage user={userContext.user} />
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Events))
