
import Page from '@components/page'

import {  GetServerSideProps } from 'next'
import { CustomUserContext } from '../../types';
import { Message, Chat, DBUser } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import makeServerCall from '../../lib/makeServerCall';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import useSWR from 'swr';
import { useRouter } from 'next/router';


// export const getServerSideProps: GetServerSideProps = async (context) => { 
//   const data = await makeServerCall({ apiCall: "users/getByUsername", method: "GET", 
//     queryParameters: { 
//       username: Array.isArray(context.params.user) ? context.params.user[0] : context.params.user 
//     },
//   })
//   const followers = await makeServerCall({ apiCall: `users/followers/${data.id}`, method: "GET" });
//   return { 
//     props: {
//       targetUser : data,
//       followerData: followers
//      }
//   }
// }

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

const ChatComponent = ({ userContext}: { userContext: CustomUserContext}) => {
  const classes = useStyles();
  const router = useRouter();
  
  const { user: contextUser, error, isLoading } = userContext;

  const makeServerCallFetcher = async url => await makeServerCall({ apiCall: url, method: "GET" })

  const [chatMembers, setChatMembers] = useState<DBUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("")
  
 
  // Grab members and messages
  const { data: chat, error: chatError } = useSWR<Chat, any>(() => `chats/${router.query.chat}`, makeServerCallFetcher, { refreshInterval: 2000 * 5 });
  
    useEffect(() => setMessages(chat ? chat.messages : []), [chat])
    useEffect(() => setChatMembers(chat ? chat.members : []), [chat])
    if (!chat && !chatError) {
        return <div> Loading...</div>
    }

  const sendMessage = async (e) => {
    const response = await makeServerCall({ apiCall: `chats/sendMessage/${router.query.chat}`, method: "POST" , 
    queryParameters: {
        authorId: userContext.user.id,
        message: messageText
    }})

    setMessageText("")
  }

   return (
    <Page header={false} activePage={"Chat"} title="Chat" userContext={userContext} >
      <Grid container>
            <Grid item xs={12} >
                <Typography variant="h5" className="header-message">Chat Members</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <Divider />
                <Divider />
                <List>
                    {chatMembers ? chatMembers.map(member => {
                    return (
                        <ListItem button key={member.id}>
                            <ListItemIcon>
                                <Avatar alt={member.firstName} src={member.picture} />
                            </ListItemIcon>
                            <ListItemText primary={member.id == userContext.user.id ? "You" :member.firstName + " " + member.lastName}></ListItemText>
                        </ListItem>
                    )}) : null}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List className={classes.messageArea} >
                    {messages ? messages.map(message => {
                    return (
                        <ListItem key={message.id}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText primary={message.text}></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText secondary={message.createdAt}></ListItemText>
                                    <ListItemText secondary={message.author.id == userContext.user.id ? "You" :message.author.firstName + " " + message.author.lastName}></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )}): null}
                </List>
                <Divider />
                <form>
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                        <TextField onChange={(e) => { setMessageText(e.target.value)}} variant={"outlined"} label="Type Something" value={messageText} fullWidth />
                            {/* <TextField id="outlined-basic-email" label="Type Something" fullWidth /> */}
                        </Grid>
                        <Grid xs={1}>
                            <Fab onClick={sendMessage} color="primary" aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </form>
                
            </Grid>
        </Grid>
    </Page>
  )
}

export default withPageAuthRequired(withUserProp(ChatComponent))
