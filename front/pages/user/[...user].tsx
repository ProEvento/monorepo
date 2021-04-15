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
import Typography from '@material-ui/core/Typography';
import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import makeServerCall from '../../lib/makeServerCall';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Chip from '@material-ui/core/Chip';
import PeopleIcon from '@material-ui/icons/People';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonIcon from '@material-ui/icons/Person';


export const getServerSideProps: GetServerSideProps = async (context) => { 
  const data = await makeServerCall({ apiCall: "users/getByUsername", method: "GET", 
    queryParameters: { 
      username: Array.isArray(context.params.user) ? context.params.user[0] : context.params.user 
    },
  })
  const followers = await makeServerCall({ apiCall: `users/followers/${data.id}`, method: "GET" });
  const badgesData = await makeServerCall({ apiCall: `users/badges`, method: "GET" ,
  queryParameters: { 
    id: data.id
  },
  })
  return { 
    props: {
      targetUser : data,
      followerData: followers,
      badgesData: badgesData
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
    marginBlockEnd: '1000',
    marginRight: 64,
    marginLeft: 48
  },
  buttons: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    marginTop: 24,
    maxWidth: 600
  }

}));

const User = ({targetUser, userContext, followerData, badgesData}: { userContext: CustomUserContext, targetUser: UserType, followerData: Array<any>, badgesData: Array<any>}) => {
  const router = useRouter();
  const classes = useStyles();
  const { user: contextUser, error, isLoading } = userContext;
  const [followers, setFollowers] = useState(followerData);

  // Data to display
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followingTopics, setFollowingTopics] = useState([]);
  const [eventsHosted, setEventsHosted] = useState([]);
  const [eventsAttending, setEventsAttending] = useState([]); 
  const [badgesReceived, setBadges] = useState(badgesData); 
  const [groups, setGroups] = useState([]); 
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

  const getBadges = async (targetUser: UserType) => {
    const earnedBadges = await makeServerCall({ apiCall: `users/badges`, method: "GET" ,
    queryParameters: { 
      id: targetUser.id
    },
    })
    setBadges(earnedBadges);
  }

  const getGroups = async (targetUser: UserType) => {
    const groupData = await makeServerCall({ apiCall: `groups/getGroupsForUser`, method: "GET" , 
    queryParameters: {
      userId: targetUser.id
    }})
    setGroups(groupData);
  }

  useEffect(() => {
    getFollowingTopics(targetUser)
    getFollowingUsers(targetUser)
    getAttending(targetUser)
    getHosted(targetUser)
    getBadges(targetUser)
    getGroups(targetUser)
  }, [])

  console.log(followingTopics, eventsAttending)
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  let title = "";

  const handleClickOpen = (targetUser, option) => {
    setDialogTitle(option)
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAccount = async () => {
    await makeServerCall({ apiCall: `users/${userContext.user.id}`, method: "DELETE" })
    router.push("/signup");
  }

  const handleMessage = async (targetUser) => {

    // find chat between two
    const response = await makeServerCall({ apiCall: `chats/getDM/${userContext.user.id}`, method: "GET" , 
    queryParameters: {
      targetId : targetUser.id,
    }})

    window.location.href = `http://localhost:3000/chats/${response.id}`
  }

   return (
    <Page header={false} activePage={"User Profile"} title={targetUser.firstName + targetUser.lastName} userContext={userContext}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Avatar alt={targetUser.firstName} src={targetUser.picture} className={classes.large}></Avatar>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 400}}>
              <Typography variant="h1" style={{fontWeight: 500, fontSize: 40}}>{targetUser.firstName}</Typography>
              <div>
              {userContext.user.id == targetUser.id ? <div></div> : 
                isUserFollowing(userContext.user.username) ? 
                  <Button variant="contained" style={{height: 32, marginTop: 8}} color="secondary" id="unfollowButton" onClick={() => {removeFollower(targetUser, userContext.user)}}>Unfollow</Button>
                  : 
                  <Button variant="contained" style={{height: 32, marginTop: 8}}  color="primary" id="followButton" onClick={() => {addFollower(targetUser, userContext.user)}}>Follow</Button>}
                  <Button variant="outlined" style={{height: 32, marginTop: 8, marginLeft: 8}}  color="primary" id="messageUser" onClick={() => {handleMessage(targetUser)}}> Send Message </Button>
                </div>
            </div>

            <div className={classes.buttons}>
            <Chip
              icon={<PersonIcon/>}
              label={`Following ${followingUsers.length} users`}
              clickable
              onClick={() => handleClickOpen(targetUser, "Following Users")}
            />
            <Chip
              icon={<LibraryBooksIcon/>}
              label={`Following ${followingTopics.length} topics`}
              clickable
              onClick={() => handleClickOpen(targetUser, "Following Topics")}
            />
            <Chip
              icon={<ScheduleIcon/>}
              label={`Hosting/hosted ${eventsHosted.length} events`}
              clickable
              onClick={() => handleClickOpen(targetUser, "Events Hosted")}
            />
            <Chip
              icon={<EventIcon/>}
              label={`Attending ${eventsAttending.length} events`}
              clickable
              onClick={() => handleClickOpen(targetUser, "Events Attending")}
            />
            <Chip
              icon={<PeopleIcon/>}
              label={`In ${groups.length} groups`}
              clickable
              onClick={() => handleClickOpen(targetUser, "Groups")}
            />
            </div>
          </div>

          
          <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{targetUser.firstName}'s {dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {dialogTitle === "Following Users" && followingUsers.map(user => {
                  return (
                    <div>
                      <Grid container direction="row" justify="space-around" alignItems="center">
                        <Avatar alt={user.firstName} src={user.picture} className={classes.small}></Avatar>
                        <h4>{user.firstName} {user.lastName}</h4>
                      </Grid>
                    </div>
                )})}
                {dialogTitle === "Following Topics" && followingTopics.map(topic => {
                  return <div className="topic">{topic.title}</div>
                })}
                {dialogTitle === "Events Hosted" && eventsHosted.map(event => {
                  return <div className="eventsHosted">{event.title}</div>
                })}
                {dialogTitle === "Events Attending" && eventsAttending.map(event => {
                  return <div className="eventsAttending">{event.title}</div>
                })}
                {dialogTitle === "Groups" && groups.map(group => {
                  return <div className="groups">{group.name}</div>
                })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button id="closeButton" onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          
      </div>

      <div>
        
        
      </div>

      <div>
        <h2>Bio</h2>
        <p>{targetUser.bio}</p>
      </div>
      
      {(targetUser.linkedin || targetUser.github || targetUser.twitter) && <Divider/>}
      {(targetUser.linkedin || targetUser.github || targetUser.twitter) && <h2>Social Media Links</h2>}
      <ul>
        {targetUser.linkedin && <li><i>Linkedin {targetUser.linkedin}</i></li>}
        {targetUser.github && <li><i>Github: {targetUser.github}</i></li>}
        {targetUser.twitter && <li><i>Twitter: {targetUser.twitter}</i></li>}
      </ul>
      <Divider/>
      <h2>Badges</h2>
      {badgesReceived.map(badge => {
          return <Image width={76} alt={badge.name} height={110} src={badge.img} />
      })}

      <Divider/>
      {userContext.user.id === targetUser.id && <Button style={{marginTop: 14}} onClick={deleteAccount} variant="contained" color="secondary">Delete account</Button>}
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(User))
