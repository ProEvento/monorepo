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
import classes from '*.module.css';
import { EventBusy } from '@material-ui/icons';
import Event from '@components/event'
import User from '@components/user'
// Simple tabs, TabPanel, a11yProps, useStyles: https://material-ui.com/components/tabs/#centered

export const getServerSideProps = withPageAuthRequired();

const Explore = ({ userContext }: { userContext: CustomUserContext }) => {
  const { user, error, isLoading } = userContext;  
  const tabs = SimpleTabs();
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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

async function getUsers(value) {
  const data = await makeServerCall({apiCall: "search/user", method: "GET", queryParameters: {query: value.split(" ").join(",")}})
  console.log(data)
  return data;
}

async function getEvents(value) {
  const data = await makeServerCall({apiCall: "search/event", method: "GET", queryParameters: {query: value.split(" ").join(",")}})
  return data;
}


function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState()

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleSearchClick = async () => {
    if (value === 0)
      setResults(await getEvents(search))
    else
      setResults(await getUsers(search))
  }
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="search">
          <Tab label="Search for Events" {...a11yProps(0)} />
          <Tab label="Search for Users" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TextField id="outlined-basic" label="Search for Events..." variant="outlined" value={search} onChange={handleSearchChange}></TextField>
        <Button variant="contained" color="primary" onClick={handleSearchClick}>Search</Button>
        
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TextField id="outlined-basic" label="Search for Users..." variant="outlined" value={search} onChange={handleSearchChange}></TextField>
        <Button variant="contained" color="primary" onClick={handleSearchClick}>Search</Button>
        
      
      </TabPanel>
      
    </div>
  );
}


export default withUserProp(Explore)
