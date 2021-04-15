import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Page from '@components/page'
import CreateGroupComponent from '@components/group/create'
import { withUserProp } from '@lib/withUserProp';
import { CustomUserContext } from 'types';

export const getServerSideProps = withPageAuthRequired();

const CreateGroup = ({ userContext}: { userContext: CustomUserContext}) => {
  return (
    <Page header={false} activePage={"Create Event"} title={"Make your own Event!"} userContext={userContext}>
      <CreateGroupComponent userContext={userContext} />
    </Page>
  )
}

export default withUserProp(CreateGroup)
