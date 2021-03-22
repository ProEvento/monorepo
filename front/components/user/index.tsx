import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


type Props = {
    imgURL?: string,
    firstName?: string,
    lastName?: string
}

const User = ({imgURL, firstName, lastName}: Props) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar></Avatar>
            </ListItemAvatar>
            <ListItemText primary={firstName + " " + lastName}></ListItemText>
        </ListItem>
    )
}

export default User
