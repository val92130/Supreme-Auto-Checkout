import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Navigation from './Navigation';

export default class Home extends Component {
  render() {
    return (
      <div>
        <TextField
          hintText="Hint Text"
        />
        <Navigation />
      </div>
    );
  }
}
