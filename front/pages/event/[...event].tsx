import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Page from '@components/page'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'

import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType, UserType} from '../../../api/types'
import { GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';
import {Grid, Button} from "@material-ui/core"
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React from 'react'
import Link from 'next/link';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {TextField} from '@material-ui/core';
import { hostname } from "os";
import PersonIcon from '@material-ui/icons/Person';
import Chip from '@material-ui/core/Chip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    img: {
      height: 100
    },
    right_button: {
    
    }
  }),
);




const Event = ({event, userContext, targetUser}: { attendees:any, userContext: CustomUserContext, event:EventType, targetUser: UserType}) => {
  const [username, setUsername] = useState("")
  const [badge, setBadge] = useState("")
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

  const giveBadge = async () => {
    const giveBadge = await makeServerCall({ apiCall: `users/badges`, method: "POST",
    queryParameters: {
        host : event.host.id,
        text : badge,
        img : `/badges/${badge}.png`
    }})
    const data = await makeServerCall({ apiCall: `users/notifications/${event.host.id}`, method: "POST", 
    queryParameters: { 
      text: `You've been given a badge ${badge} by ${userContext.user.username}!`
      },
    })

    location.reload();

  };




  const isHost = user.username === (event.host ? event.host.username : user.username);
  // console.log("are hosting event", isHost)
  const [dialogTitle, setDialogTitle] = useState("");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  let title = "";

  const handleClickOpen = (targetUser, option) => {
    // setDialogTitle(option)
    setDialogTitle("attendees");

    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>

      <div style={{display: 'flex', flexDirection: 'column'}}>
      <h1>{event.title}</h1>

      <h4>{dateEvent.toLocaleDateString(undefined,options)} @ {dateEvent.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
      {event.host && <h5>Hosted By: {event.host.firstName} {event.host.lastName}</h5>}
      </div>
  

    
      {event.picture &&
        <div>
        <br/>
        <br/>
        <img id="pic" src={event.picture} className={styles.img} />
        <br/>
        <br/>

        </div>
      
      }
     
      <div style={{display: 'flex', flexDirection: 'column'}}>
      {event.priv
        ? <h5>Private Event </h5>
        : <h5>Open Event</h5>
      }
      {event.Topic &&
        <h5>Topic: {event.Topic.title}</h5>
      }
      </div>
      <br/>
      <Chip
        icon={<PersonIcon/>}
        size="small"
        label={`${event.attendees.length} Attendees `}
        clickable
        onClick={() => handleClickOpen(targetUser, "Groups")}
      />
      <br />
      <br />

      {attend &&
        <Button id="joinButton" disabled={Date.now() < dateEvent.getTime()} href={`/meeting/${event.id}`} > 
          <a>Join Meeting</a>
        </Button>
      }
            <br />
            <br />

      <h5>{event.description}</h5>
      <br />
      <br />  
      <Divider/>     

      <div style={{display: 'flex',justifyContent:'space-around', flexDirection: 'row'}}>
      {attend && !isHost &&
      
       <div>
         <br />  
         <div>
            Pick a Badge: {" "}
            <select value={badge} onChange={(e) => { setBadge(e.target.value) }}>
              <option value="greathost">Great Host</option>
              <option value="fun">Fun</option>
              <option value="engaging">Engaging</option>
              <option value="informative">Informative</option>
              <option value="professional">Professional</option>
              <option value="exciting">Exciting</option>
              <option value="inspirational">Inspiring</option>
              <option value="educational">Educational</option>
              <option value="talented">Talented</option>
              <option value="organized">Organized</option>
              <option value="considerate">Considerate</option>
            </select>
          </div>
        <br/>
        <form>
        <Button id='giveBadge' onClick={giveBadge} disabled={Date.now() < dateEvent.getTime() || Date.now() > dateEvent.getTime()+3600000}  color="primary">Give Badge</Button>
        <i>Badges may only be awarded within 1 hour of event conclusion</i> 
        </form>
       </div>
      }

      {attend&&
        <form>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <TextField id="username" onChange={(e) => {setUsername(e.target.value) }} label="Username" value={username} />
        <Button id='sendinvite' onClick={inviteUser}  color="primary">Invite User</Button>
        </div>

        </form>
      
      }
      </div>
    
  
      <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center', height: '10vh'}}>
        {isHost && <Button onClick={cancelEvent} color="secondary" variant="contained">Cancel Event</Button>}
      </div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '10vh'}}>
        {!attend &&
          <Button onClick={joinEvent} className={styles.button}>Attend this event</Button>
        }
        {attend && !isHost &&
            <Button onClick={leaveEvent} color="secondary" variant="contained">Unattend this event</Button>
        }
      </div>



        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {dialogTitle === "attendees" && event.attendees.map(user => {
                  return (
                    <div>
                      <Grid container direction="row" justify="space-around" alignItems="center">
                        <Avatar alt={user.firstName} src={user.picture} className={styles.small}></Avatar>
                        <h4>{user.firstName} {user.lastName}</h4>
                      </Grid>
                    </div>
                )})}         
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button id="closeButton" onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>

    {/* {event.attendees.map((attendee) => {
      return <div className="attendees">{attendee.firstName} {attendee.lastName}</div>
    })} */}

    </Page>
  )
}


export default withUserProp(Event)