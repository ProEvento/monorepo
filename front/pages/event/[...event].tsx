import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType, UserType} from '../../../api/types'
import { GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';
import {Grid, Button} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react'
import Link from 'next/link';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {TextField} from '@material-ui/core';



export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const data = await makeServerCall({ apiCall: `events/${context.params.event}`, queryParameters: { attending: true, topic: true }, method: "GET" })
    return { 
      props: {
        event: data
      }
    }
  }
})

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
    },
    img: {
      height: 100
    }
  }),
);




const Event = ({event, userContext, targetUser}: { attendees:any, userContext: CustomUserContext, event:EventType, targetUser: UserType}) => {
  const [username, setUsername] = useState("")
  let noAttendees = true; 
  if(event.attendees.length > 0){
    noAttendees = false; 
  }
  var tags = true; 
  const router = useRouter();

  const styles = useStyles()
  // console.log(targetUser)
  var attend = false; 
  const [events, setEvents] = useState([]);
  const { user, error, isLoading } = userContext;
  const leaveEvent = () => {
    makeServerCall({ apiCall: `events/leaveEvent/${event.id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => console.log(data))
    location.reload(); 
  }
  const joinEvent = () => {
    makeServerCall({ apiCall: `events/joinEvent/${event.id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => console.log(data))
    location.reload();
  }
  // const cancelEvent = () => {
  //   makeServerCall({ apiCall: `events/${event.id}`, method: "DELETE", queryParameters: { userId: user.id } }).then((data) => console.log(data))
  // }
  const cancelEvent = () => {
    makeServerCall({ apiCall: `events/${event.id}`, method: "DELETE" }).then((data) => {
        if (data.msg.toLowerCase() === "success") {
          router.push("/")
          return <></>
        } else {
          
        }
    });
  }


  //console.log(event)
  const openAttendEvent = ((e) => {

  })
  // console.log(userContext.user)
  // if(event.topic != null){
  //   tags = true
  //   console.log(event.topic.title)
  // }

  useEffect(() => {
    if (user)
      makeServerCall({ apiCall: `events/getEventsForUser/${user.id}`, method: "GET" }).then((data) => {
        setEvents(data)
      });
  }, [user])
  // console.log(events)
  

  for (var index in events){
    if(events[index].id == event.id){
      //console.log("success")
      attend = true; 
    }
  }
  var dateEvent = new Date(event.time)
  //console.log(Date.now(),  dateEvent.getTime())

  const inviteUser = async () => {
    const targetUser = await makeServerCall({ apiCall: `users/getByUsername`, method: "GET",
      queryParameters: {
        username: username
      }
    })

    //console.log("TargetUser, " , targetUser.username)
    const data = await makeServerCall({ apiCall: `users/notifications/${targetUser.id}`, method: "POST", 
    queryParameters: { 
      text: `You've been invited to http://localhost:3000/event/${event.id} by ${userContext.user.username}!`
      },
    })
  };

  const isHost = user.username === (event.host ? event.host.username : user.username);
  console.log("are hosting event", isHost)
  

  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>
       
      <h1>{event.title}</h1>
      <img id="pic" src={event.picture} className={styles.img} />

      <h4>{dateEvent.toLocaleDateString("en-US")} {dateEvent.toLocaleTimeString("en-US")}</h4>
      {event.priv
        ? <h5>Private Event </h5>
        : <h5>Open Event</h5>
      }
      {event.host && <h5>Hosted By: {event.host.firstName} {event.host.lastName}</h5>}
      <h4>{event.description}</h4>
      <br />
      <br />  
      {attend &&
        <Button id="joinButton" disabled={Date.now() < dateEvent.getTime()} href={`/meeting/${event.id}`} > 
          <a>Join Meeting</a>
        </Button>
      }
      {isHost && <Button onClick={cancelEvent} color="secondary" variant="contained">Cancel</Button>}

    
      {attend && !isHost &&
          <Button onClick={leaveEvent} className={styles.button}>Unattend this event</Button>
      }
      
      {!attend &&
        <Button onClick={joinEvent} className={styles.button}>Attend this event</Button>
      }



      <form>
          <TextField id="username" onChange={(e) => {setUsername(e.target.value) }} label="Username" value={username} />
          <Button id='sendinvite' onClick={inviteUser}  color="primary">Invite User</Button>
      </form>
      <h3>Attendees</h3>

      {noAttendees &&
        <h5>No Attendees</h5>
      }
    
    {event.attendees && <div>{event.attendees.map((attendee) => `${attendee.firstName} ${attendee.lastName} `)}</div>}
    {event.Topic &&
      <h5>Topic: {event.Topic.title}</h5>
    }
    </Page>
  )
}


export default withUserProp(Event)