import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Page from '@components/page'
import CreateEventComponent from '@components/createEvent'
import { withUserProp } from '@lib/withUserProp';
import { CustomUserContext } from 'types';

const CreateEvent = ({ userContext}: { userContext: CustomUserContext}) => {
  return (
    <Page header={false} activePage={"Create Event"} title={"Make your own Event!"} userContext={userContext}>
      <CreateEventComponent userContext={userContext} />
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(CreateEvent))
