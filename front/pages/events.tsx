import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

const Events = () => {
  const { user, error, isLoading } = useUser();  

  return (
    <Page header={false} activePage={"My Events"} title={user ? `Welcome, ${user.name}!` : "Welcome!"}>
      
    </Page>
  )
}

export default withPageAuthRequired(Events)
