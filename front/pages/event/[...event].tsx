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
import ButtonGroup from '@material-ui/core/ButtonGroup'



export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await makeServerCall({ apiCall: `events/${context.params.event}`, method: "GET" })
  const attenders = await makeServerCall({ apiCall: `events/getEventAttendees/${context.params.event}`, method: "GET" })
  // const host = await
  return { 
    props: {
      event : data,
      attendees: attenders
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




const Event = ({attendees, event, userContext, targetUser}: { attendees:any, userContext: CustomUserContext, event:EventType, targetUser: UserType}) => {
// const [open, setOpen] = useState(false);
// const [Attendees, setAttendees] = useState([]); 

// this.state = {attendees}
// const handleClickOpen = (targetUser, option) => {
//   if (option == "Attendees") {
//     getAttendees(targetUser)
//   }
//   setOpen(true);  
// };

// const handleClose = () => {
//   setOpen(false);
//   setAttendees([]);
// };
  const usersAttending = attendees
  var noAttendees = true; 
  if(attendees.length != 0){
    noAttendees = false; 
  }
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
  // const getAttendees = () => {
  //   const attenders = makeServerCall({ apiCall: `events/getEventAttendees/${event.id}`, method: "GET" })
  //   console.log(attenders)
  // }
  
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
       
      <h1>{event.title}</h1>
      <ButtonGroup size="small" aria-label="small outlined button group">
          <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(targetUser, "Following Users")}}> Attendees </Button>
      </ButtonGroup>
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
      <h3>Attendees</h3>

      {noAttendees &&
        <h5>No Attendees</h5>
      }
    
      {usersAttending.map(topic => {
        return <div>{topic.firstName}</div>
      })}

    </Page>
  )
}


export default withPageAuthRequired(withUserProp(Event))