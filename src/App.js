import React, { Component } from 'react';
import AppBar from "./components/AppBar";
import List from "./components/List";
import Search from "./components/Search";
import Footer from "./components/Footer";
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

class App extends Component {
  state = {
    username: null,
  }

  submit = (username) => {
    this.setState({
      username,
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <AppBar />

          <Switch>
            <Route path="/" exact component={(props) => (<Search submit={this.submit} {...props} />)} />
            <Route path="/:user" exact component={(props) => (<List username={this.state.username} {...props} />)} />
            <Route component={() => <Redirect to="/" />}/>
          </Switch>

          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
