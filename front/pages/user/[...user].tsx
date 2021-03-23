import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Divider from '@material-ui/core/Divider'
import Page from '@components/page'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import makeServerCall from '../../lib/makeServerCall';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const getServerSideProps: GetServerSideProps = async (context) => { 
  const data = await makeServerCall({ apiCall: "users/getByUsername", method: "GET", 
    queryParameters: { 
      username: Array.isArray(context.params.user) ? context.params.user[0] : context.params.user 
    },
  })
  const followers = await makeServerCall({ apiCall: `users/followers/${data.id}`, method: "GET" });
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
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
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

  // Data to display
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingTopics, setFollowingTopics] = useState([]);
  const [eventsHosted, setEventsHosted] = useState([]);
  const [eventsAttending, setEventsAttending] = useState([]); 
  const [dialogTitle, setDialogTitle] = useState("");
  
  const isUserFollowing = (targetUsername: string)  => {
    // isUserFollowing(userContext.user.username)
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

  const getFollowingTopics = async (targetUser: UserType) => {
    const topics = await makeServerCall({ apiCall: `users/topics/${targetUser.id}`, method: "GET" })
    setFollowingTopics(topics);
  }

  const getFollowingUsers = async (targetUser: UserType) => {
    const followingUsers = await makeServerCall({ apiCall: `users/following/${targetUser.id}`, method: "GET" })
    setFollowingUsers(followingUsers);
  }

  const getAttending = async (targetUser: UserType) => {
    const events = await makeServerCall({ apiCall: `events/getAttending/${targetUser.id}`, method: "GET" })
    setEventsAttending(events);
  }

  const getHosted = async (targetUser: UserType) => {
    const events = await makeServerCall({ apiCall: `events/getEventsForUser/${targetUser.id}`, method: "GET" })
    setEventsHosted(events);
  }

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  let title = "";

  const handleClickOpen = (targetUser, option) => {
    if (option == "Following Users") {
      getFollowingUsers(targetUser)
    } else if (option == "Following Topics") {
      getFollowingTopics(targetUser)
    } else if (option == "Events Hosted") {
      getHosted(targetUser)
    } else {
      getAttending(targetUser)
    }
    setDialogTitle(option)
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
    setFollowingUsers([]);
    setFollowingTopics([]);
    setEventsHosted([]);
    setEventsAttending([]);
  };

   return (
    <Page header={false} activePage={"User Profile"} title={targetUser.firstName} userContext={userContext}>
      <Grid container direction="row" justify="space-around" alignItems="center" >
          <Avatar alt={targetUser.firstName} src={targetUser.picture} className={classes.large}></Avatar>
          {isUserFollowing(userContext.user.username) ? <Button onClick={() => {removeFollower(targetUser, userContext.user)}}>Unfollow</Button> : <Button onClick={() => {addFollower(targetUser, userContext.user)}}>Follow</Button>}
          <ButtonGroup size="small" aria-label="small outlined button group">
            <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(targetUser, "Following Users")}}> Following Users </Button>
            <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(targetUser, "Following Topics")}}> Following Topics </Button>
            <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(targetUser, "Events Hosted")}}> Events Hosted </Button>
            <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(targetUser, "Events Attending")}}> Events Attending </Button>
          </ButtonGroup>
          
          <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{targetUser.firstName}'s {dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {followingUsers.map(user => {
                  return (
                    <div>
                      <Grid container direction="row" justify="space-around" alignItems="center">
                        <Avatar alt={user.firstName} src={user.picture} className={classes.small}></Avatar>
                        <h4>{user.firstName}</h4>
                      </Grid>
                    </div>
                )})}
                {followingTopics.map(topic => {
                  return <div>{topic.title}</div>
                })}
                {eventsHosted.map(event => {
                  return <div>{event.title}</div>
                })}
                {eventsAttending.map(event => {
                  return <div>{event.title}</div>
                })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          
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
