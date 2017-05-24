import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from 'react-materialize';

export default class RenderAdjust extends Component {
  render() {
    return (
      <div>
        <div className="centerFixed">
          <h2>Adjust your camera</h2>
          <Button onClick={this.props.startStageDevelop}>Ready</Button>
        </div>
        {this.props.children}
      </div>
    )
  }
}
