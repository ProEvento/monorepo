import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import React from 'react';
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

// Simple tabs: https://material-ui.com/components/tabs/#centered

export const getServerSideProps = withPageAuthRequired();

const Explore = ({ userContext }: { userContext: CustomUserContext }) => {
  const { user, error, isLoading } = userContext;  
  const tabs = SimpleTabs({ user });
  return (
    <Page header={false} activePage={"Explore"} title={"Explore"} userContext={userContext}>
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

async function getUsers(value) {
  const data = await makeServerCall({apiCall: "search/user", method: "GET", queryParameters: {query: value}})
  return data
}

async function getEvents(value) {
  console.log(value)
  const data = await makeServerCall({apiCall: "search/event", method: "GET", queryParameters: {query: value}})
  return data
}

function SimpleTabs({ user }) {
  const classes = useStyles();
  const [search, setSearch] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [results, setResults] = React.useState([]);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    setResults([])
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const cancelEvent = (id: number) => {
    makeServerCall({ apiCall: `events/${id}`, method: "DELETE" }).then((data) => {
        if (data.msg.toLowerCase() === "success") {
          location.reload();
        } else {
          
        }
    });
  }

  const leaveEvent = (id: number) => {
    makeServerCall({ apiCall: `events/leaveEvent/${id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => {
      if (data.msg.toLowerCase() === "success") {
        location.reload()
      } else {
      }
    })
  }

  const joinEvent = (id: number) => {
    makeServerCall({ apiCall: `events/joinEvent/${id}`, method: "POST", queryParameters: { userId: user.id } }).then((data) => {
      if (data.msg.toLowerCase() === "success") {
        makeServerCall({ apiCall: `events/${id}`, method: "GET"}).then((eventData) => location.reload())
      } else {
      }
    })
  }



  console.log(results)
  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} aria-label="search">
        <Tab label="Search for Events" {...a11yProps(0)} />
        <Tab label="Search for Users" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TextField style={{height: 50}} id="outlined-basic" label="Search for Events..." variant="outlined"  value={search} onChange={handleSearchChange}></TextField>
        <Button style={{marginLeft: 8, height: 50 }}  variant="contained" onClick={async () => setResults((await getEvents(search)).results)}>Search</Button>
        {value === 0 && results.length > 0 && results.map((event) => <Event user={user} cancelEvent={cancelEvent} joinEvent={joinEvent} leaveEvent={leaveEvent} event={event}/>)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TextField style={{height: 50}}  id="outlined-basic" label="Search for Users..." variant="outlined" value={search} onChange={handleSearchChange}></TextField>
        <Button style={{marginLeft: 8, height: 50 }} variant="contained" onClick={async () => setResults((await getUsers(search)).results)}>Search</Button>
        {value === 1 && results.length > 0 && results.map((user) => <User username={user.username} imgURL={user.picture} firstName={user.firstName} lastName={user.lastName}/>)}
      </TabPanel>
    </div>
  );
}


export default withUserProp(Explore)
