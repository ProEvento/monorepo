import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

const Profile = () => {
  const { user, error, isLoading } = useUser();  

  return (
    <Page header={false} activePage={"Profile"} title={user.name}>
      
    </Page>
  )
}

export default withPageAuthRequired(Profile)
