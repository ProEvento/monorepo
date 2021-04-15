import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Input, Button} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import makeServerCall from '@lib/makeServerCall';
import Event from '@components/event'
import User from '@components/user'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventPage from '@components/feed';

// Simple tabs: https://material-ui.com/components/tabs/#centered

export const getServerSideProps = withPageAuthRequired();

const Explore = ({ userContext }: { userContext: CustomUserContext }) => {
  const { user, error, isLoading } = userContext;  
  const tabs = SimpleTabs({ user });
  return (
    <Page header={false} activePage={"My Feed"} title={"My Feed"} userContext={userContext}>
      {tabs}
    </Page>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 1200,
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));


function SimpleTabs({ user }) {
  
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [topicEvents, setTopicEvents] = useState([]);
  const [load, setLoad] = useState(true);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    updateTabs();
  }

  if(load){
    updateTabs();
    setLoad(false)
  }

  function updateTabs(){
    if (user)
        //Get upcoming events for user
        makeServerCall({ apiCall: `events/getEventsForUser/${user.id}`, method: "GET" }).then((data) => {
            const cleaned = []
            const today = new Date()
            for (const event of data) {
                const { time, title, description, host, attendees, id } = event
                let dupe = false
                for (const item of cleaned) {
                    if (item.id === id) dupe = true
                }
                const eventDay = new Date(time)
                if (!dupe && eventDay >= today)
                    cleaned.push({ host: host ? host : user, time, title, description, attendees, id})
                dupe = false
            }
            cleaned.sort(timeCompare)
            setUpcomingEvents([...cleaned])
        });
        //Get events made by users in the same group
        makeServerCall({ apiCall: `events/getUserGroupEvents`, method: "GET",  queryParameters: { id: user.id } }).then((data) => {
            const cleaned = []
            const today = new Date()
            for (const event of data) {
                const { time, title, description, host, attendees, id } = event
                let dupe = false
                for (const item of cleaned) {
                    if (item.id === id) dupe = true
                }
                const eventDay = new Date(time)
                if (!dupe && eventDay >= today)
                    cleaned.push({ host: host ? host : user, time, title, description, attendees, id})
                dupe = false
            }
            cleaned.sort(timeCompare)
            setGroupEvents([...cleaned])
        });
        //Get events made by users in the same group
        makeServerCall({ apiCall: `events/getUserTopicEvents`, method: "GET",  queryParameters: { id: user.id } }).then((data) => {
            const cleaned = []
            const today = new Date()
            for (const event of data) {
                const { time, title, description, host, attendees, id } = event
                let dupe = false
                for (const item of cleaned) {
                    if (item.id === id) dupe = true
                }
                const eventDay = new Date(time)
                if (!dupe && eventDay >= today)
                    cleaned.push({ host: host ? host : user, time, title, description, attendees, id})
                dupe = false
            }
            cleaned.sort(timeCompare)
            let random = []
            if (cleaned.length > 10){
                const shuffled = cleaned.sort(() => 0.5 - Math.random());
                random = shuffled.slice(0, 10);
            }
            else{
                random = cleaned
            }
            setTopicEvents([...random])
        });
};  
  

  function timeCompare(a, b) {
    const eventA = a.time;
    const eventB = b.time;
  
    let comparison = 0;
    if (eventA > eventB) {
      comparison = 1;
    } else if (eventA < eventB) {
      comparison = -1;
    }
    return comparison;
  }

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} aria-label="search">
        <Tab label="Upcoming Registered Events" {...a11yProps(0)} />
        <Tab label="User Group Events" {...a11yProps(1)} />
        <Tab label="Recommended Events" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EventPage user={user} events={upcomingEvents} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EventPage user={user} events={groupEvents} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EventPage user={user} events={topicEvents} />
      </TabPanel>
    </div>
  );
}


export default withUserProp(Explore)
