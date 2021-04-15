import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import makeServerCall from '../../lib/makeServerCall';

import Link from "next/link"

type Props = {
    imgURL?: string,
    firstName: string,
    lastName: string,
    username: string,
    group?: object,
}

const inviteUser = async (username, group) => {
    const targetUser = await makeServerCall({ apiCall: `users/getByUsername`, method: "GET",
      queryParameters: {
        username: username
      }
    })

    await makeServerCall({ apiCall: `users/notifications/${targetUser.id}`, method: "POST", 
        queryParameters: { 
            text: `You've been invited to <a href="http://localhost:3000/groups/${group.id}">${group.name}</a>! Click <a href="http://localhost:3000/groups/${group.id}">Here</a> to join!`
        },
    })
  };


const User = ({imgURL, firstName, lastName, username, group}: Props) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar></Avatar>
            </ListItemAvatar>

            <ListItemText secondary={group && <Button onClick={async () => await inviteUser(username, group)} variant="contained">Invite User</Button>} primary={<Link href={`/user/${username}`}>{firstName + " " + lastName}</Link>}></ListItemText>
        </ListItem>
    )
}

export default User
