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
  console.log(attendees)
  const mapped = attendees.map((e) => <Avatar alt={e.username} key={e.id} src={e.picture}>{!e.picture && `${e.firstName[0]}${e.lastName[0]}`}</Avatar>)
  return <AvatarGroup max={4}>{mapped}</AvatarGroup>;
  
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
    <Link href={`/event/${id}`} style={{ textDecoration: 'none' }}>
      <div className="grid-container">
      <div className="date">
        <div className="number">{date.getDate()}</div>
        <div className="day">{days[date.getDay()]}</div>
      </div>
      <div className="info">
        <Typography variant="h4">{title}</Typography>
        {/*@ts-ignore */}
        <Typography variant="h5">{date.toLocaleDateString("en-US", options)} @ {date.toLocaleTimeString("en-US")}</Typography>
        <Typography variant="h6">hosted by <Link href={`/user/${host.username}`}>{host.firstName} {host.lastName}</Link></Typography>
      </div>
      <div className="users">{getAttendeeAvatars(attendees)}</div>

      <style jsx>{`

        .grid-container {
          display: grid;
          grid-template-columns: 0.6fr 1.8fr 0.6fr;
          grid-template-rows: 1fr;
          gap: 0px 0px;
          grid-template-areas:
            "date info users";
          color: #535353;
          padding: var(--gap-double) 0px;
          background: #FFFFFF;
          border: 1px solid #000000;
          box-sizing: border-box;
          border-radius: 12px;
          margin-bottom: 24px;
          transition: all .2s ease-in-out;
        }

        .grid-container:hover {
          transform: scale(1.05);
          text-decoration: none;
        }
        .users { grid-area: users; display: flex; justify-content: center; align-items: center;}
        .info {
          display: flex;
          flex-direction: column;
          grid-area: info;
          margin-left: var(--gap);
        }
        .date {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: .5fr 1.5fr;
          gap: 0px 0px;
          grid-template-areas:
            "day day day"
            "number number number";
          grid-area: date;
          border-right: 1px solid #373737;
        }
        .number { 
          grid-area: number;
          font-size: 48px;
          margin: 0 auto;
          font-weight: 500;
        }
        .day {
          grid-area: day;
          font-size: 14px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-weight: 500;
         }
        `}</style>
    </div>
    </Link>
    )
}

// <ListItem className={classes.root}>
//       <Typography variant="h5">
//         {days[date.getDay()]} 
//         <ListItemAvatar>
//         <Avatar style={{fontSize: 20}}>
//           {date.getDate()}
//         </Avatar>
//       </ListItemAvatar>
//       </Typography>
//       <div style={{marginLeft: 10, marginRight: 10 }}>
//         <Typography variant="h5">{title}</Typography>
//           <div>
//             <Typography variant="h6">
//               {/* @ts-expect-error */}
//               {date.toLocaleDateString("en-US", options)} {date.toLocaleTimeString("en-US")}
//             </Typography>
//             <Typography variant="caption">
//               Hosted by {host.username === user.username ? 'you' : <Link href={`/user/${host.username}`}>{host.firstName} {host.lastName}</Link>}
//             </Typography>
//           </div>
//       </div> 
//       <ListItemText primary={<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minWidth: 100}}>{getAttendeeAvatars(attendees)}</div>}/>
//         {isHost && <Button onClick={() => cancelEvent(id)} color="secondary" variant="contained">Cancel</Button>}
//         {isAttending && !isHost && <Button onClick={() => leaveEvent(id)} variant="contained" color="secondary">Leave</Button>}
//         {!isHost && !isAttending && <Button variant="contained" onClick={() => joinEvent(id)}>Join</Button>}
//         <a href={`/event/${id}`}><Button id="visitButton" style={{marginLeft: 'var(--gap)'}} variant="contained">Visit</Button></a>
//     </ListItem>
const Event = ({user, event,  cancelEvent, joinEvent, leaveEvent } : {user: User, event: any, cancelEvent: Function, joinEvent: Function, leaveEvent: Function }) => {
    const classes = useStyles();
    return (<Item user={user} event={event} cancelEvent={cancelEvent} joinEvent={joinEvent} leaveEvent={leaveEvent} />)
}

export default Event