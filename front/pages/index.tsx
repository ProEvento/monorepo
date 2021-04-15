import Page from '@components/page'
import { withUserProp } from '../lib/withUserProp';
import { CustomUserContext } from '../types';
import { useRouter } from 'next/router';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const Home = ({ userContext }: { userContext: CustomUserContext}) => {
  const router = useRouter();
  const responsiveDialog = ResponsiveDialog();
  // Not logged in
  if (!userContext.user) {
    return (
      <Page header={false} activePage={"Dashboard"} title={`Welcome!`} userContext={userContext}>
       <h2> Welcome to ProEvento! Please Sign Up on the left to get started! </h2>
        {responsiveDialog}
      </Page>
    )
  } else {
    router.push(`/user/${userContext.user.username}`)
    return (<Page header={false} activePage={"Dashboard"} title={`Welcome!`} userContext={userContext}>
      Welcome to ProEvento! Please Sign Up on the left to get started!
    </Page>)
  }
}

// Responsive dialog: https://material-ui.com/components/dialogs/#responsive-full-screen

export function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  let [dialogInc, setDialogInc] = React.useState(0);
  let [dialogText, setDialogText] = React.useState("ProEvento allows you to attend events about topics that interest you.");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setDialogInc(++dialogInc);
    if (dialogInc === 1) {
      setDialogText("You can follow other users and see what events they've been attending.")
    }
    else if (dialogInc === 2) {
      setDialogText("You can also search for events and user groups. Once you sign up, you can choose the topics that interest you. Enjoy the app!");
    }
    if (dialogInc === 3) {
      setOpen(false);
      setDialogInc(0);
      setDialogText("ProEvento allows you to attend events about topics that interest you.");
    }
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        View App Benefits
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Overview of ProEvento"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withUserProp(Home)
