import { useState } from "react"
import { UserContext } from "@auth0/nextjs-auth0";
import {TextField, Button, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

type FormEntry = {
  name: string,
  key: string,
  type: "text" | "multitext",
  rows?: number,
  set: Function,
  value: string,
  required?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 'var(--gap)',
      marginBottom: 'var(--gap)'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      flex: 1
    }
  }),
);

const Signup = ({ userContext }: { userContext: UserContext}) => {
  const router = useRouter();
  const { user } = userContext;
  const [lastName, setLastName] = useState(user.family_name.toString() ?? "")
  const [firstName, setFirstName] = useState(user.name.toString() ?? user.nickname.toString() ?? "" )
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [twitter, setTwitter] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [response, setResponse] = useState("")

  const classes = useStyles();
  const fields: FormEntry[] = [
    { name: "First Name", key: "firstName", type: "text", set: setFirstName, value: firstName, required: true },
    { name: "Last Name", key: "lastName", type: "text", set: setLastName, value: lastName, required: true },
    { name: "Username", key: "username", type: "text", set: setUsername, value: username, required: true },
    { name: "LinkedIn URL", key: "linkedin", type: "text", set: setLinkedin, value: linkedin},
    { name: "GitHub Username", key: "github",type: "text", set: setGithub, value: github},
    { name: "Twitter Username", key: "twitter", type: "text", set: setTwitter, value: twitter},
    { name: "Bio (500 character max)", key: "bio", type: "multitext", rows: 5, set: setBio, value: bio },
  ];

  const submit = (e: any) => {
    e.preventDefault();
    const toSend = {
      lastName,
      firstName,
      linkedin,
      github,
      twitterHandle: twitter,
      bio,
      email: user.email,
      username: username || user.username || ""
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSend)
    };

    let resp = null;
    fetch('/api/userSignup', requestOptions)
      .then(response => response.json())
      .then(data => { 
        setResponse(data.msg)
      });
  }

  if (response.toLowerCase() === "success") {
    router.push("/")
    return <></>
  }

  return (
    <form className={classes.root}>
        <div className={classes.row}>
          <Typography variant="h6">👋, {user.name}! Now that you've signed up, please provide us with some more information so we can complete your onboarding.</Typography>
        </div>  
        {response && response !== "success" && <Typography variant="h6">‼️{response}‼️</Typography>}
        <div className={classes.row}>
          <Typography variant="subtitle2">You can change these at any time by accessing the "Settings" button at the bottom of the sidebar!</Typography>
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[0]} />
          <ControlledTextField entry={fields[1]} />
          <ControlledTextField entry={fields[2]} />
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[3]} />
          <ControlledTextField entry={fields[4]} />
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[5]} />
          <ControlledTextField entry={fields[6]} />
        </div>

        <Button onClick={submit} size="large" variant="contained" color="primary">Save & Go to ProEvento</Button>
    </form>
    )

}



const ControlledTextField = ({entry}: { entry: FormEntry }) => {
  return <TextField onChange={(e) => { entry.set(e.target.value) }} required={entry.required} style={{margin: 'var(--gap-double)'}} variant={"outlined"} id={entry.key} label={entry.name} value={entry.value} multiline={entry.type === "multitext"} rows={entry.rows} />
}

export default Signup
