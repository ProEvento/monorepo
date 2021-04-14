import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Link from "next/link"

type Props = {
    imgURL?: string,
    firstName: string,
    lastName: string,
    username: string
}

const User = ({imgURL, firstName, lastName, username}: Props) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar></Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Link href={`/user/${username}`}>{firstName + " " + lastName}</Link>}></ListItemText>
        </ListItem>
    )
}

export default User
