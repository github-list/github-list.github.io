import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import MaterialListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Divider from '@material-ui/core/Divider';
import ListItem from './ListItem';
import languagesList from "../languages.json";
import { calculateRatio } from "../utils/contrast";
import getEnv from "../constants";

const { API_URL, GITHUB_STAR_PROJECT } = getEnv();


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: theme.palette.background.paper,
    margin: [[32, "auto", 0]],
    boxShadow: theme.shadows[1],
    boxSizing: "border-box"
  },
  language: {
    padding: [[4, 4]],
    borderRadius: 2
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    "padding": [[64, 0]]
  },
  error: {
    display: "flex",
    justifyContent: "center",
    padding: [[64]],
  }
});

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const getColor = (lang) => languagesList[lang] ? languagesList[lang].color : "inherit";

class FolderList extends React.Component {
  state = {
    userRepos: [],
    loading: true,
    error: ""
  }

  getData = async () => {
    const { user: username } = this.props.match.params;

    let res;

    try {
      res = await fetch(`${API_URL}/user/${username}`).then(res => res.json());
    } catch (e) {
      console.error(e);

      res = {
        ok: false
      };
    }

    const { ok, error, repos: userRepos } = res;

    if ( !ok ) {
      if ( error === "Not starred" ) {
        return this.setState({
          loading: false,
          error: <Fragment>You haven't opted in yet. Do it by starring <a href={GITHUB_STAR_PROJECT} target="_blank" rel="noopener noreferrer">This Project</a></Fragment>
        });
      }

      if ( error === "GitHub error" ) {
        return setTimeout(this.getData, 1000);
      }

      return this.setState({
        loading: false,
        error: "Server error – please try again"
      })
    }

    this.setState({
      userRepos,
      loading: false
    });
  }

  async componentDidMount() {
    this.getData();
  }

  render() {
    const { classes } = this.props;
    const { userRepos, loading, error } = this.state;

    const { user: username } = this.props.match.params

    if ( loading ) {
      return (
        <div className={classes.root}>
          <List className={ classes.loading }>
            <CircularProgress className={classes.progress} size={100} />
          </List>
        </div>
      );
    }

    if ( !loading && error ) {
      return (
        <div className={classes.root}>
          <List className={ classes.error }>
            <Typography color="error" variant="display1" align="center">{error}</Typography>
          </List>
        </div>
      );
    }

    const items = userRepos.map(({id, name, createdAt, language, url, stars}) => {
      const date = new Date(createdAt);
      const formattedDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()

      const backgroundColor = getColor(language);
      let textColor = "inherit";

      if ( backgroundColor !== "inherit" ) {
        const ratioWhite = calculateRatio("#ffffff", backgroundColor);
        const ratioBlack = calculateRatio(backgroundColor, "#000000");

        if ( ratioWhite > ratioBlack ) {
          textColor = "#fff";
        } else {
          textColor = "#000";
        }
      }

      const secondary = (
        <React.Fragment>
          Language: <span
            style={{
              backgroundColor,
              color: textColor,
            }}
            className={classes.language}
          >
            {language ? language : "none"}
          </span>
          {` • Created on ${formattedDate}`}
          {` • Stars: ${stars}`}
        </React.Fragment>
      );

      return (
        <ListItem
          key={id}
          primary={name}
          secondary={secondary}
          language={language}
          url={url}
        />
      )
    });

    const titleText = `${username} has ${userRepos.length} ${userRepos.length === 1 ? "repository" : "repositories"}`;

    return (
      <div className={classes.root}>
        <List>
          <MaterialListItem>
            <Typography variant="display1">{titleText}</Typography>
          </MaterialListItem>
          { items }
        </List>
      </div>
    );
  }
}

FolderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderList);