import { useEffect, useState } from "react"
import {Grid, Button, List} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from "next/link"
import Group from './group'
import makeServerCall from "@lib/makeServerCall";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'var(--button2)',
      width: 400,
      margin: "0 auto"
    },
    root: {
        maxWidth: 800,
        margin: "0 auto",
        marginTop: 'calc(var(--gap-double) * 4)',
    }
  }),
);

const Groups = ({ user, groups }) => {
    const styles = useStyles()


    return (
        <section className={styles.root}>
            <section style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--gap-double)'}}>
                <Link href="/groups/create"><Button id="newGroup" className={styles.button}>create a new group</Button></Link>
            </section>
            <List>
              {groups.map((e) => <Group user={user} key={e.id} group={e}/>)}
            </List>
        </section>
    )
}

export default Groups