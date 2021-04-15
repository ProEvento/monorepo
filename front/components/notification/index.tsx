/* eslint-disable react/no-danger, react-hooks/exhaustive-deps */
import {useState, useEffect, useRef, Fragment}  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import useLocalStorage from '@lib/useLocalState';

const useStyles = makeStyles((theme) => ({
  paper: {
    transformOrigin: 'top right',
  },
  list: {
    width: theme.spacing(40),
    maxHeight: theme.spacing(40),
    overflow: 'auto',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1, 0),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  root: {
    position: 'absolute',
    right: '10%',
    top: '10%'
  }
}));

export default function Notifications({ notifications }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const anchorRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [lastSeen, setLastSeen] = useLocalStorage('lastSeen', '-1');
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setTooltipOpen(false);

    if (messages && messages.length > 0) {
      setLastSeen(messages[0].id)
    }
  };

  useEffect(() => setMessages((notifications || []).reverse()), [notifications])

  return (
    <div className={classes.root}>
      <Tooltip
        open={tooltipOpen}
        onOpen={() => {
          setTooltipOpen(!open);
        }}
        onClose={() => {
          setTooltipOpen(false);
        }}
        title={'Toggle notifications'}
        enterDelay={300}
      >
        <IconButton
          color="inherit"
          ref={anchorRef}
          aria-controls={open ? 'notifications-popup' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Badge
            color="secondary"
            badgeContent={
              messages
                ? messages.reduce(
                    (count, message) => (message.id > lastSeen ? count + 1 : count),
                    0,
                  )
                : 0
            }
          >
            <NotificationsIcon fontSize={'large'} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        id="notifications-popup"
        anchorEl={anchorRef.current}
        open={open}
        placement="bottom-end"
        transition
        disablePortal
        role={undefined}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener
            onClickAway={() => {
              setOpen(false);
            }}
          >
            <Grow in={open} {...TransitionProps}>
              <Paper className={classes.paper}>
                <List className={classes.list}>
                  {messages && messages.length > 0 ? (
                    messages.map((message, index) => (
                      <Fragment key={message.id}>
                        <ListItem alignItems="flex-start" className={classes.listItem}>
                          <span
                            id="notification-message"
                          >
                            <Typography id="notificationText" gutterBottom dangerouslySetInnerHTML={{__html: message.text}}></Typography>
                          </span>

                          {message.createdAt && (
                            <Typography variant="caption" color="textSecondary">
                              {new Date(message.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              {new Date(message.createdAt).toLocaleTimeString('en-US')}
                            </Typography>
                          )}
                        </ListItem>
                        {index < messages.length - 1 ? (
                          <Divider className={classes.divider} />
                        ) : null}
                      </Fragment>
                    ))
                  ) : (<ListItem alignItems="flex-start" className={classes.listItem}><Typography gutterBottom>You have no notifications. Maybe create an event?</Typography></ListItem>)}
                </List>
              </Paper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
}