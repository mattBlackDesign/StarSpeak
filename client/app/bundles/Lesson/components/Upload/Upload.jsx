import React, {Component} from 'react';
import VideosList from './videos/VideosList';
import FileInput from './forms/FileInput';

export default class Upload extends Component{
  constructor(props) {
    super(props);
    this.state = {
      videos: []
    }
    this.handleCreateVideo = this.handleCreateVideo.bind(this);
  }

  componentDidMount() {
    FileStore.getResources()
    .then(data => {
      this.setState({ videos: data.videos });
    });
  }

  handleCreateVideo(video) {
    this.setState({ videos: $.merge([video], this.state.videos) });
  }

  render() {
    return (
      <div>
        <VideosList videos={this.state.videos} />
        <FileInput onCreateVideo={this.handleCreateVideo} />
      </div>
    )
  }
}
