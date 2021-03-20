import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Page from '@components/page'
import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import makeServerCall from '../../lib/makeServerCall';

export const getServerSideProps: GetServerSideProps = async (context) => {

  // GET localhost:8080/api/users/getByUsername?username=username 
 
  const data = await makeServerCall({ apiCall: "users/getByUsername", method: "GET", 
    queryParameters: { 
      username: Array.isArray(context.params.user) ? context.params.user[0] : context.params.user 
    },
  })

  return { 
    props: {
      targetUser : data
     }
  }
}
const User = ({targetUser, userContext }: { userContext: CustomUserContext, targetUser: UserType }) => {
  const { user: contextUser, error, isLoading } = userContext;
  console.log(targetUser)
   return (
    <Page header={false} activePage={"User Profile"} title={targetUser.firstName} userContext={userContext}>
      <Avatar alt={targetUser.firstName} src={targetUser.picture}>
        
      </Avatar>
      <h1>{targetUser.firstName} {targetUser.lastName}</h1>
        <Chip color="primary" label="Following Users"/>
        <Chip color="primary" label="Following Topics"/>
      <Divider/>
        <Chip color="primary" label="Events Attending"/>
        <Chip color="primary" label="Events Hosting"/>
      <Divider/>
      <h2>Bio</h2>
      <Divider/>
      <h2>Social Media Links</h2>
        <Chip color="primary" label="Events Attending"/>
        <Chip color="primary" label="Events Hosting"/>
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(User))
