import { useUser, UserContext } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import useSWR from 'swr';
import { CustomUserContext } from '../types'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeServerCall from './makeServerCall'
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const fetcher = async url => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    //@ts-expect-error
    error.info = await res.json()
    //@ts-expect-error
    error.status = res.status
    throw error
  }

  return res.json()
}

const textFetcher = async url => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    //@ts-expect-error
    error.info = await res.json()
    //@ts-expect-error
    error.status = res.status
    throw error
  }

  return res.text()
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
      setDialogText("You can also search for events based on topic, date, or user groups involved to see what's out there. Enjoy the app!");
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


export const withUserProp = (Component: any) => {
  return (props: any) => {
    const user = useUser();
    const router = useRouter();
    const { data, error } = useSWR(() => `/api/getUserByEmail?email=${user.user.email}`, fetcher, { refreshInterval: 60000 * 5 });
    const responsiveDialog = ResponsiveDialog();
    const makeServerCallFetcher = async url => await makeServerCall({ apiCall: url, method: "GET" })

    const { data: notifData, error: notifError } = useSWR(() => `users/notifications/${data.id}`, makeServerCallFetcher, { refreshInterval: 60000 * 5 });

    const isLoading = !data && !error;
    console.log("error", error)
    if (typeof window !== "undefined" && !isLoading && error && error.status === 404) {
      router.push("/signup")
    }
    const mergedUser: (CustomUserContext) = (user.user && data) ? {
      ...user,
      user: {
        ...user.user,
        ...data,
        notifications: notifData
      }
     } : {
       user: undefined,
       isLoading: false,
       checkSession: () => undefined
     }

     if (user.isLoading || (isLoading && user.user !== undefined)) {
       return <div style={{position: "absolute", left: "50%", top: "50%"}}>
         <CircularProgress />
         </div>
     }
     if (!user.isLoading && user.user === undefined) {
       return <div>
         {responsiveDialog}
       </div>
     }
    return <Component userContext={mergedUser} {...props} />;
  };
};
