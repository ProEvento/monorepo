import { useState} from "react"
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
import { useUser } from '@auth0/nextjs-auth0';

const drawerWidth = 240;

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
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

type Props = {
  header?: boolean,
  footer?: boolean,
  title?: string,
  description?: string,
  image?: string,
  activePage: string,
  children?: React.ReactNode
}

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
    url: "/profile"
  },
  {
    name: "My Events",
    url: "/events"
  }
]

const Page = ({
  header = true,
  footer = true,
  title,
  description,
  image,
  children,
  activePage
}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, error, isLoading } = useUser();  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography style={{display: "flex", justifyContent: "center"}} variant="h6" >
              ProEvento
        </Typography>
        </div>
      <Divider />
      <List>
        {user && Pages.map(({ name, url }, index) => (
          <ListItem selected={name === activePage} component="a" href={url} button key={name}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
        {!user && !error && !isLoading && <ListItem component="a" href="/api/auth/login" button>
            <ListItemText primary={"Login"} />
          </ListItem>}
      </List>
      <Divider />
      <List>
          {user && <ListItem component="a" href="/api/auth/logout" button>
            <ListItemText primary={"Logout"} />
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
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
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
        <div className={classes.toolbar} />
        {isLoading && <div>Loading</div>}
        {error && <div>Error</div>}
        {!error && !isLoading && children}
      </main>
    </div>
  )
}


export default Page
