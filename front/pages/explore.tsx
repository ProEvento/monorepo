import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

const Explore = () => {
  const { user, error, isLoading } = useUser();  

  return (
    <Page header={false} activePage={"Explore"} title={"Explore"}>
      
    </Page>
  )
}

export default withPageAuthRequired(Explore)
