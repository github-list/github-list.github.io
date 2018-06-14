import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { Redirect } from "react-router-dom";

import getEnv from "../constants";
const { API_URL, GITHUB_STAR_PROJECT } = getEnv();

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: 32,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: [[32, "auto", 0]],
    boxShadow: theme.shadows[1],
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  textFieldCont: {
    marginTop: 24,
    marginBottom: 24,
    width: "50%",
  },
  note: {
    marginTop: 24,
  }
});

const zws = "​";

class Search extends React.Component {
  state = {
    username: "",
    error: zws, // NOTE it should be a zero width space in here
    success: false,
    validationLoading: false,
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { username } = this.state;

    if ( username === "" ) {
      return this.setState({
        error: "Username cannot be empty"
      })
    }

    let res;

    try {
      this.setState({ validationLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      res = await fetch(`${API_URL}/user/${username}/check`).then(res => res.json());
      this.setState({ validationLoading: false });
    } catch (e) {
      this.setState({ validationLoading: false });

      console.error(e);

      res = {
        ok: false
      };
    }

    const { ok, error } = res;

    if ( !ok ) {
      if ( error === "Not starred" ) {
        return this.setState({
          error: <Fragment>You haven't opted in yet. Do it by starring <a href={GITHUB_STAR_PROJECT} target="_blank" rel="noopener noreferrer">This Project</a></Fragment>
        })
      } else {
        return this.setState({
          error: "Server error – please try again"
        })
      }
    }

    return this.setState({
      success: true
    })
  }

  onUsernameChange = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  render() {
    const { classes } = this.props;
    const { validationLoading, success, username, error } = this.state;

    if ( success ) {
      return (
        <Redirect to={`/${username}`} />
      )
    }

    return (
      <Paper className={classes.root} component="form" onSubmit={this.onSubmit}>
        <Typography variant="display1" align="center">Enter username to see all public repositories you have contributed to.</Typography>
        <div className={classes.textFieldCont}>
          <TextField
            fullWidth
            onChange={this.onUsernameChange}
            label="GitHub username"
            value={username}
            error={error !== zws}
            helperText={ validationLoading ? (<LinearProgress component="span" />) : error }
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
        <Typography className={classes.note} variant="caption" align="center">Note: To include organization in search you must have “Organization visibility” set to “Public”.</Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(Search);