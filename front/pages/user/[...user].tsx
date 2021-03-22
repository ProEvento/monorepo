import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Divider from '@material-ui/core/Divider'
import Page from '@components/page'
import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import makeServerCall from '../../lib/makeServerCall';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps = async (context) => { 
  const data = await makeServerCall({ apiCall: "users/getByUsername", method: "GET", 
    queryParameters: { 
      username: Array.isArray(context.params.user) ? context.params.user[0] : context.params.user 
    },
  })

  const followers = await makeServerCall({ apiCall: `users/followers/${data.id}`, method: "GET" })
  return { 
    props: {
      targetUser : data,
      followerData: followers
     }
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  large: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    marginBlockEnd: '1000'
  }

}));

const User = ({targetUser, userContext, followerData}: { userContext: CustomUserContext, targetUser: UserType, followerData: Array<any>}) => {
  const classes = useStyles();
  const { user: contextUser, error, isLoading } = userContext;
  const [followers, setFollowers] = useState(followerData);
  
  const isUserFollowing = (targetUsername: string)  => {
    for (let follower of followers) {
      if (follower.username === targetUsername) {
        return true
      }
    }
    return false
  }

  const removeFollower = async (targetUser: UserType, user: UserType) => {
    const response = await makeServerCall({ apiCall: `users/removeFollower`, method: "DELETE" , 
    queryParameters: {
      userfollowed : targetUser.username,
      unfollower : user.username
    }})
  }

  const addFollower = async (targetUser: UserType, user: UserType) => {
    const response = await makeServerCall({ apiCall: `users/addFollower`, method: "PUT" , 
    queryParameters: {
      userfollowed : targetUser.username,
      follower : user.username
    }})
  }

   return (
    <Page header={false} activePage={"User Profile"} title={targetUser.firstName} userContext={userContext}>
      <Grid container direction="row" justify="space-around" alignItems="center" >
          <Avatar alt={targetUser.firstName} src={targetUser.picture} className={classes.large}></Avatar>
          {isUserFollowing(userContext.user.username) ? <Button onClick={() => {removeFollower(targetUser, userContext.user)}}>Unfollow</Button> : <Button onClick={() => {addFollower(targetUser, userContext.user)}}>Follow</Button>}
          <ButtonGroup size="small" aria-label="small outlined button group">
            <Button>Following Users</Button>
            <Button>Following Topics</Button>
            <Button>Events Hosted</Button>
            <Button>Events Attending</Button>
          </ButtonGroup>
      </Grid>

      <div>
        
        
      </div>
      <h1>{targetUser.firstName}</h1>

      <div>
        <h2>Bio</h2>
        <p>{targetUser.bio}</p>
      </div>
      
      <Divider/>
      <h2>Social Media Links</h2>
      <ul>
        <li><i>Linkedin {targetUser.linkedin}</i></li>
        <li><i>Github: {targetUser.github}</i></li>
        <li><i>Twitter: {targetUser.twitter}</i></li>

      </ul>
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(User))
