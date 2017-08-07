import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

export default class Home extends Component {
  render() {
    return (
      <div>
        <TextField
          hintText="Hint Text"
        />
      </div>
    );
  }
}
