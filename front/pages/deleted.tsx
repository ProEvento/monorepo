import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Page from '@components/page'
import SignupComponent from '@components/signup'

export const getServerSideProps = withPageAuthRequired();

const Deleted = () => {
  const userContext = useUser();  
  return (
    <Page header={false} activePage={"Deleted"} title={"Sorry Account Deleted"} userContext={userContext}>
        <h1>Sorry your account has been deleted. Please sign up with another email/social media acccount</h1>
    </Page>
  )
}

export default Deleted
