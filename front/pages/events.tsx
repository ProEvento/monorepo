import { useEffect, useState } from "react"
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
import makeServerCall from '@lib/makeServerCall';
import Calendar from "react-material-ui-calendar";

/*
* useStyles function and Event component adapted from Folder List, Align List Items: https://material-ui.com/components/lists/
*/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: 'inline',
    }
  }),
);

export const getServerSideProps = withPageAuthRequired();

const EventsPage = ({ userContext }: { userContext: CustomUserContext}) => {
  const { user, error, isLoading } = userContext;
  const [events, setEvents] = useState([]);
  //console.log(userContext)
  if (isLoading) {
    return <div></div>;
  }

  useEffect(() => {
    if (user)
      makeServerCall({ apiCall: `events/getEventsForUser/${user.id}`, method: "GET" }).then((data) => {
        const cleaned = []
        for (const event of data) {
          const { time, title, description, host, attendees, id } = event
          let dupe = false
          for (const item of cleaned) {
            if (item.id === id) dupe = true
          }
          if (!dupe)
            cleaned.push({ host: host ? host : user, time, title, description, attendees, id})
          dupe = false
        }
        setEvents([...cleaned])
      });
  }, [user])

  const classes = useStyles();

  return (
    <Page header={false} activePage={"My Events"} title={user ? `Welcome, ${user.name}!` : "Welcome!"} userContext={userContext}>
        <EventPage user={userContext.user} events={events} />
        <Calendar generalStyle={{
          maxWidth: "100%",
          margin: "0 auto",
          backgroundColor: "rgba(256,256,256,1)",
          height: "100%",
          overflow: "auto"
          }}
          light={true} 
          />
    </Page>
  )
}

export default withUserProp(EventsPage)
