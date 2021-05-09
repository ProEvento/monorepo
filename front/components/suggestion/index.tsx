import { useEffect, useState } from "react"
import {Grid, Button, List} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from "next/link"
import Event from '../suggestion_one'
import makeServerCall from "@lib/makeServerCall";
import { CustomUserContext } from "types";

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

const DisplaySuggestion = ({ suggested_events }: { suggested_events:any}) => {
    const styles = useStyles()
    const [error, setError] = useState("")
    

    return (
        <section className={styles.root}>
            <section style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--gap-double)'}}>
                <Link href="/createEvent"><Button id="newEvent" className={styles.button}>create a new event</Button></Link>
            </section>
            {/* @ts-ignore */}
            <List>
              {suggested_events.map((e) => <Event suggested_event={e}/>)}
            </List>
        </section>
    )
}

export default DisplaySuggestion