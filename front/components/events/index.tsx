import {Grid, Button, List} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from "@components/link"
import Event from '../event'

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

    const openCreateEvent = ((e) => {

    })

    return (
        <section className={styles.root}>
            <section style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--gap-double)'}}>
                <Button onClick={openCreateEvent} className={styles.button}>create a new event</Button>
            </section>
            
            <List>
              {events.map((e) => <Event key={e.id} attendees={e.attendees} title={e.title} dateTime={e.time} host={e.AttendingTable ? e.host : user} />)}
            </List>
        </section>
    )
}

export default Events