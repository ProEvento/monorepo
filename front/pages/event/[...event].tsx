import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType, UserType} from '../../../api/types'
import {  GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';
import Moment from 'moment';
import {Grid, Button} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react'
import Link from 'next/link';


export const getServerSideProps: GetServerSideProps = async (context) => {

  const data = await makeServerCall({ apiCall: `events/${context.params.event}`, method: "GET" })
  
  return { 
    props: {
      event : data
     }
  }
}

//have username -> make call to see if attending?


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'var(--button2)',
      width: 200,
    },
    root: {
        maxWidth: 800,
        margin: "0 auto",
        marginTop: 'var(--gap-double)'
    }
  }),
);
Moment.locale('en');


const Event = ({event, userContext, targetUser}: { userContext: CustomUserContext, event:EventType, targetUser: UserType}) => {
  const styles = useStyles()
  // console.log(targetUser)
  var attend = false; 
  const [events, setEvents] = useState([]);
  const { user, error, isLoading } = userContext;

  const leaveEvent = () => {
    makeServerCall({ apiCall: `events/leaveEvent/${event.id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => console.log(data))
  }
  const joinEvent = () => {
    makeServerCall({ apiCall: `events/joinEvent/${event.id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => console.log(data))
  }

  
  const openAttendEvent = ((e) => {

  })
  // console.log(userContext.user)


  useEffect(() => {
    if (user)
      makeServerCall({ apiCall: `events/getEventsForUser/${user.id}`, method: "GET" }).then((data) => {
        setEvents(data)
      });
  }, [user])
  // console.log(events)

  for (var index in events){
    if(events[index].id == event.id){
      console.log("success")
      attend = true; 
    }
  } 
  var dateEvent = new Date(event.time)
  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>
      <h1>Hello {userContext.user.username}</h1>
      <h1>{event.title}</h1>
      <h4> {Moment(event.time).format('LT ddd MMM YY')} </h4>
      {event.priv
        ? <h5>Private Event </h5>
        : <h5>Open Event</h5>
      }
      <h5>Hosted By: {event.User_id}</h5>
      <h4>{event.description}</h4>
      {attend &&
        <Button disabled={Date.now() < dateEvent.getTime()} href={`/meeting/${event.id}`} > 
        <a>Join Meeting</a>
        </Button>
      }
      {attend
        ?  <Button onClick={leaveEvent} className={styles.button}>Unattend this event</Button>
        :  <Button onClick={joinEvent} className={styles.button}>Attend this event</Button>
      }

    </Page>
  )
}


export default withPageAuthRequired(withUserProp(Event))