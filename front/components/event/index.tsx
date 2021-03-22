import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { DBUser, User } from 'types';
import Link from '@components/link'

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
  return attendees.map((e) => <Avatar alt={e.username} key={e.id} src={e.picture}>{!e.picture && `${e.firstName[0]}${e.lastName[0]}`}</Avatar>)
}
const Item = ({ title, dateTime, host, attendees }: { title: string, dateTime: number, host: DBUser | User, attendees: DBUser[] }) => {
  const classes = containerStyles();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <ListItem className={classes.root}>
      <Typography variant="h5">
        {days[(new Date(dateTime)).getDay()]} 
        <ListItemAvatar>
        <Avatar>
          <EventIcon />
        </Avatar>
      </ListItemAvatar>
      </Typography>
      <ListItemText 
        primary={<Typography variant="h5">{title}</Typography>}
        secondary={
          <React.Fragment>
            <Typography variant="h6">
              {/* @ts-expect-error */}
              {(new Date(dateTime)).toLocaleDateString("en-US", options)}
            </Typography>
            <Typography variant="caption">
              Hosted by <Link href={`/user/${host.username}`}>{host.firstName} {host.lastName}</Link>
            </Typography>
          </React.Fragment>
        }
      />
      <ListItemText primary={<>{getAttendeeAvatars(attendees)}</>}/>
    </ListItem>
    )
}

const Event = ({title, dateTime, host, attendees} : {title: string, dateTime: number, host: DBUser | User, attendees: DBUser[]}) => {
    const classes = useStyles();
    return (<Item host={host} title={title} dateTime={dateTime} attendees={attendees} />)
}

export default Event