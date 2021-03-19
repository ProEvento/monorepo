import {Grid, Button} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from "@components/link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'var(--button2)',
      width: 200
    },
    root: {
        maxWidth: 800,
        margin: "0 auto",
        marginTop: 'var(--gap-double)'
    }
  }),
);

const Events = ({ user }) => {
    const styles = useStyles()

    const openCreateEvent = ({ e: MouseEvent) => {

    }

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={styles.root}
        >
            <section>
                <Button onClick={openCreateEvent} className={styles.button}>create a new event</Button>
            </section>

        </Grid>
    )
}

export default Events