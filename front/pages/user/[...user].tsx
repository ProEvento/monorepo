import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Page from '@components/page'
import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/api/getByUsername?username=${context.params.user}`,{method : "GET"});
  const data = await res.json()

  return { 
    props: {
      user : data
     } 
  }
}
const User = ({user, userContext }: { userContext: CustomUserContext, user: UserType }) => {

  return (
    <Page header={false} activePage={"User Profile"} title={user.firstName} userContext={userContext}>
      <Avatar alt={user.firstName} src=" ">
        
      </Avatar>
      <h1>{user.firstName} {user.lastName}</h1>
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
