import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Avatar, Button} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { DBUser, User } from 'types';
import Link from 'next/link'
import { DataUsageOutlined } from '@material-ui/icons';
import makeServerCall from '@lib/makeServerCall';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1
    },
    inline: {
      display: 'inline',
    },
  }),
);

const containerStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: 140,
      flex: 1,
      justifyContent: 'center',
      background: 'white',
      marginBottom: 'var(--gap)',
      borderRadius: 12,
      marginTop: 'var(--gap)',
    },
  })
);


const getAttendeeAvatars = (attendees: DBUser[]) => {
  const mapped = attendees.map((e) => <Avatar alt={e.username} key={e.id} src={e.picture}>{!e.picture && `${e.firstName[0]}${e.lastName[0]}`}</Avatar>)
  return <AvatarGroup max={4}>{mapped}</AvatarGroup>;
  
}

const Item = ({ user, group }) => {
  const classes = containerStyles();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
  const { users, owner, name, description, logo, createdAt, pollTime } = group;

//   const isHost = user.username === (host ? host.username : user.username);
//   const isAttending = !!attendees.find((attendee) => attendee.username === user.username)

  const handleMessage = async () => {
    // find chat between two
    const response = await makeServerCall({ apiCall: `chats/getGroupchat/${group.id}`, method: "GET" })

    window.location.href = `http://localhost:3000/chats/${response.id}`
  }

  return (
    <ListItem className={classes.root}>
      <ListItemText 
        primary={<Typography variant="h5">{name}</Typography>}
        secondary={
          <React.Fragment>
            <Typography variant="caption" style={{marginRight: 4, width: "100%", display: "block"}}>
              {description} 
            </Typography>
            <Typography variant="caption">
              created by <Link href={`/user/${owner.username}`}>{owner.username}</Link> on {new Date(createdAt).toLocaleTimeString("en-US")}
            </Typography>
          </React.Fragment>
        }
      />
      <ListItemText primary={<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>{getAttendeeAvatars(users)}</div>}/>
        {/* {isHost && <Button onClick={() => cancelEvent(id)} color="secondary" variant="contained">Cancel</Button>}
        {isAttending && !isHost && <Button onClick={() => leaveEvent(id)} variant="contained" color="secondary">Leave</Button>}
        {!isHost && !isAttending && <Button variant="contained" onClick={() => joinEvent(id)}>Join</Button>} */}
        <Button variant="outlined" color="primary" id="messageUser" onClick={() => {handleMessage()}}> Message </Button>
        <Link href={`/groups/${group.id}`}><Button id="visitButton" style={{marginLeft: 'var(--gap)'}} variant="contained">Visit</Button></Link>
    </ListItem>
    )
}

const Group = ({user, group} : {user: User, group: any }) => {
    const classes = useStyles();
    return (<Item user={user} group={group} />)
}

export default Group