import Page from '@components/page'
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import { useRouter } from 'next/router'

const Home = ({ userContext }: { userContext: CustomUserContext}) => {
  const router = useRouter()
  // Not logged in
  if (!userContext.user) {
    return (
      <Page header={false} activePage={"Dashboard"} title={`Welcome!`} userContext={userContext}>
       <h2> Welcome to ProEvento! Please Sign Up on the left to get started! </h2>
      </Page>
    )
  } else {
    router.push(`/user/${userContext.user.username}`)
    return (<Page header={false} activePage={"Dashboard"} title={`Welcome!`} userContext={userContext}>
      Welcome to ProEvento! Please Sign Up on the left to get started!
    </Page>)
  }
 

}

export default withUserProp(Home)
