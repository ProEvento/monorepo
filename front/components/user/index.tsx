import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import makeServerCall from '../../lib/makeServerCall';
import Typography from '@material-ui/core/Typography';

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
        <li className="grid-container">
            <div className="avatar"><Avatar src={imgURL} style={{height: 86, width: 86, marginLeft: 24, marginRight: 24}} alt={`${firstName} ${lastName}`}></Avatar></div>
            <div className="info">
            <Typography variant="h5" style={{color: 'black', fontSize: 25, }}>{firstName} {lastName}</Typography>
            <Typography variant="h6" style={{color: 'black', fontSize: 20, fontStyle: 'italic', fontWeight: 300}}>{username}</Typography>
            </div>
            <div className="buttons">
                {group && <Button onClick={async () => await inviteUser(username, group)} variant="contained">Invite User</Button>} 
                <Link href={`/user/${username}`}><Button variant="contained">Visit user</Button></Link>
            </div>
            <style jsx>{`
                .grid-container {
                    display: grid;
                    grid-template-columns: 0.7fr 1.6fr 0.7fr;
                    grid-template-rows: 1fr 1fr 1fr;
                    gap: 0px 0px;
                    grid-template-areas:
                        "avatar info buttons"
                        "avatar info buttons"
                        "avatar info buttons";
                    color: #535353;
                    padding: var(--gap-double) 0px;
                    background: #FFFFFF;
                    border: 1px solid #000000;
                    box-sizing: border-box;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    max-width: 700px;
                    margin-top: var(--gap);
                    margin-bottom: var(--gap);
                }    

                .avatar { grid-area: avatar; }
                .info { grid-area: info; }
                .buttons { grid-area: buttons; }
            `}</style>
        </li>
    )
}

export default User
