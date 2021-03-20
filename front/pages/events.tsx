import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EventIcon from '@material-ui/icons/Event';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import EventPage from '@components/events';

/*
* useStyles function and Event component adapted from Folder List, Align List Items: https://material-ui.com/components/lists/
*/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    }
  }),
);

const Events = ({ userContext }: { userContext: CustomUserContext}) => {
  const { user, error, isLoading } = userContext;  
  const classes = useStyles();
  const fakeEvents = [
    {
      title: "Science Class",
      dateTime: Date.now().toLocaleString(),
      host: "Mr. Smith",
    },
    {
      title: "History Class",
      dateTime: Date.now().toLocaleString(),
      host: "Mr. Johnson",
    },
    {
      title: "Math Class",
      dateTime: Date.now().toLocaleString(),
      host: "Mrs. Jackson",
    },
  ];
  let events = [];
  for (let i = 0; i < fakeEvents.length; i++) {
    events.push(
      <Event classes={classes} title={fakeEvents[i].title} dateTime={fakeEvents[i].dateTime} host={fakeEvents[i].host} />
    );
    events.push(
      <Divider />
    );
  } 
  return (
    <Page header={false} activePage={"My Events"} title={user ? `Welcome, ${user.name}!` : "Welcome!"} userContext={userContext}>
        <EventPage user={userContext.user} />
        <List className={classes.root}>
        {events}
      </List>
    </Page>
  )
}

const Event = ({classes, title, dateTime, host}) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <EventIcon />
        </Avatar>
        </ListItemAvatar>
        <ListItemText 
          primary={title}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary" 
              >
                Hosted by {host}
              </Typography>
                {" on " + dateTime} 
            </React.Fragment>
          }
          />
      </ListItem>

  )
}

export default withPageAuthRequired(withUserProp(Events))
