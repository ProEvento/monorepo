import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Page from '@components/page'
import SignupComponent from '@components/signup'

const Signup = () => {
  const userContext = useUser();  
  console.log(userContext)
  return (
    <Page header={false} activePage={"Login"} title={"Finish signing up"} userContext={userContext}>
      <SignupComponent userContext={userContext} />
    </Page>
  )
}

export default withPageAuthRequired(Signup)
