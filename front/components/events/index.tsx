import { useEffect, useState } from "react"
import {Grid, Button, List} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from "next/link"
import Event from '../event'
import makeServerCall from "@lib/makeServerCall";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'var(--button2)',
      width: 200,
      margin: "0 auto"
    },
    root: {
        maxWidth: 800,
        margin: "0 auto",
        marginTop: 'calc(var(--gap-double) * 4)',
    }
  }),
);

const Events = ({ user, events }) => {
    const styles = useStyles()
    const [error, setError] = useState("")
    
    const cancelEvent = (id: number) => {
      makeServerCall({ apiCall: `events/${id}`, method: "DELETE" }).then((data) => {
          if (data.msg.toLowerCase() === "success") {
            location.reload();
          } else {
            setError(data)
          }
      });
    }
 
    const leaveEvent = (id: number) => {
      makeServerCall({ apiCall: `events/leaveEvent/${id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => {
        if (data.msg.toLowerCase() === "success") {
          location.reload()
        } else {
          setError(data)
        }
      })
    }

    const joinEvent = (id: number) => {
      makeServerCall({ apiCall: `events/joinEvent/${id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => {
        if (data.msg.toLowerCase() === "success") {
          makeServerCall({ apiCall: `events/${id}`, method: "GET"}).then((eventData) => location.reload())
        } else {
          setError(data)
        }
      })
    }

    console.log(error)
  
    const openCreateEvent = ((e) => {

    })

    return (
        <section className={styles.root}>
            <section style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--gap-double)'}}>
                <Link href="/createEvent"><Button className={styles.button}>create a new event</Button></Link>
            </section>
            {/* @ts-ignore */}
            {error && error.msg}
            <List>
              {events.map((e) => <Event leaveEvent={leaveEvent} joinEvent={joinEvent} cancelEvent={cancelEvent} user={user} key={e.id} event={e}/>)}
            </List>
        </section>
    )
}

export default Events