import React from "react";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    padding: "1em",
    textAlign: "center",
    marginTop: ".5em",
    boxSizing: "border-box",
    fontSize: "1.25em",
  },
  emoji: {
    color: "#000",
  }
});

const Footer = ({ classes }) => (
  <footer className={classes.root}>
    <Typography color="textSecondary">Made with <span className={classes.emoji} role="img" aria-label="heart">❤️</span>by <a href="https://legiec.io">bibixx</a></Typography>
  </footer>
);

export default withStyles(styles)(Footer);