import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Avatar, Button} from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { DBUser, User } from 'types';
import Link from '@components/link'
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
      marginBottom: 'calc(2 * var(--gap))',
      borderRadius: 12,
    },
  })
);


const getAttendeeAvatars = (attendees: DBUser[]) => {
  const mapped = attendees.map((e) => <Avatar alt={e.username} key={e.id} src={e.picture}>{!e.picture && `${e.firstName[0]}${e.lastName[0]}`}</Avatar>)
  if (mapped.length < 3) {
    return mapped;
  } else {
    return mapped.slice(0, 2);
  }
}

const Item = ({ user, event, cancelEvent, joinEvent, leaveEvent }) => {
  const [response, setResponse] = useState("")
  const classes = containerStyles();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
  const { time, title, description, host, attendees, id } = event;
  const date = new Date(time)

  const isHost = user.username === (host ? host.username : user.username);
  const isAttending = !!attendees.find((attendee) => attendee.username === user.username)

  return (
    <ListItem className={classes.root}>
      <Typography variant="h5">
        {days[date.getDay()]} 
        <ListItemAvatar>
        <Avatar style={{fontSize: 20}}>
          {date.getDate()}
        </Avatar>
      </ListItemAvatar>
      </Typography>
      <ListItemText 
        primary={<Typography variant="h5">{title}</Typography>}
        secondary={
          <React.Fragment>
            <Typography variant="h6">
              {/* @ts-expect-error */}
              {date.toLocaleDateString("en-US", options)}
            </Typography>
            <Typography variant="caption">
              Hosted by {host.username === user.username ? 'you' : <Link href={`/user/${host.username}`}>{host.firstName} {host.lastName}</Link>}
            </Typography>
          </React.Fragment>
        }
      />
      <ListItemText primary={<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>{getAttendeeAvatars(attendees)}</div>}/>
        {isHost && <Button onClick={() => cancelEvent(id)} variant="contained">Cancel</Button>}
        {isAttending && !isHost && <Button onClick={() => leaveEvent(id)} variant="contained">Leave</Button>}
        {!isHost && !isAttending && <Button variant="contained" onClick={() => joinEvent(id)}>Join</Button>}
    </ListItem>
    )
}

const Event = ({user, event,  cancelEvent, joinEvent, leaveEvent } : {user: User, event: any, cancelEvent: Function, joinEvent: Function, leaveEvent: Function }) => {
    const classes = useStyles();
    return (<Item user={user} event={event} cancelEvent={cancelEvent} joinEvent={joinEvent} leaveEvent={leaveEvent} />)
}

export default Event