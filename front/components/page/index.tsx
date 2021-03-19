import { useState} from "react"
import { UserContext } from "@auth0/nextjs-auth0"
import Head from '@components/head'
// import Header from '@components/header'
import styles from './page.module.css'
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CustomUserContext } from "../../types";
import Image from 'next/image'

const drawerWidth = 325;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    background: theme.palette.background.default,
    color: 'var(--fg)'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    height: 140,
    borderTop: 'none',
    paddingLeft: 48,
    paddingTop: 48
  },
  list: {
    width: drawerWidth,
  },
  listItem: {
    "&:hover": {
      backgroundColor: "var(--button)",
      color: "#535353"
    },
    width: `calc(${drawerWidth}px - ${drawerWidth/4}px)`,
    margin: 30,
    borderRadius: 16,
    height: 60,
    overflowX: 'hidden'
  }
}));

type Props = {
  header?: boolean,
  footer?: boolean,
  title?: string,
  description?: string,
  image?: string,
  activePage: string,
  children?: React.ReactNode,
  userContext: UserContext | CustomUserContext
}

const Page = ({
  header = true,
  footer = true,
  title,
  description,
  image,
  children,
  activePage,
  userContext
}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, error, isLoading } = userContext;

  const Pages = [
    {
      name: "Dashboard",
      url: "/"
    },
    {
      name: "Explore",
      url: "/explore"
    },
    {
      name: "Profile",
      url: `/user/${user ? user.username : ''}`
    },
    {
      name: "My Events",
      url: "/events"
    }
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
            <Image width={87} height={78} src="/logo.png" />
      </div>
      <List className={classes.list}>
        {user && Pages.map(({ name, url }, index) => (
          <ListItem className={classes.listItem} selected={name.toLowerCase() === activePage.toLowerCase()} component="a" href={url} button key={name}>
            <ListItemText  primaryTypographyProps={{variant: "h5"}} primary={name} />
          </ListItem>
        ))}
        {!user && !error && !isLoading && 
          <ListItem className={classes.listItem} component="a" selected={activePage.toLowerCase() === "signup"}  href="/api/auth/login" button>
            <ListItemText  primaryTypographyProps={{variant: "h5"}} primary={"Login"} />
          </ListItem>}
      </List>
      <List>
          {user && <ListItem className={classes.listItem}  component="a" href="/api/auth/logout" button>
            <ListItemText primaryTypographyProps={{variant: "h5"}} primary={"Logout"} />
          </ListItem>}
      </List>
    </div>
  );


  return (
    <div className={classes.root}>
      <Head
        title={`${title ? `${title} - ` : ''} ProEvento`}
        description={description}
        image={image}
      />
      <CssBaseline />
      <Hidden smUp implementation="css">
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {isLoading && <div>Loading</div>}
        {error && <div>Error</div>}
        {!error && !isLoading && children}
      </main>
    </div>
  )
}


export default Page
