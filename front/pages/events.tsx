import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import EventPage from '@components/events';
import Event from '@components/event';

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
      <Event title={fakeEvents[i].title} dateTime={fakeEvents[i].dateTime} host={fakeEvents[i].host} />
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

export default withPageAuthRequired(withUserProp(Events))
