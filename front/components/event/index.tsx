import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    }
  }),
);

const Event = ({title, dateTime, host}) => {
    const classes = useStyles();
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <EventIcon />
          </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={title}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary" 
                >
                  Hosted by {host}
                </Typography>
                  {" on " + dateTime} 
              </React.Fragment>
            }
            />
        </ListItem>
  
    )
}

export default Event