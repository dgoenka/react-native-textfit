import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  NativeModules
} from 'react-native'

const UIManager = NativeModules.UIManager;

class TextFit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 0.5,
      complete: false,
    }
  }

  setSize() {
    const maxHeight = this.props.height;
    if(this.refs.field)
    this.refs.field.measure((x, y, width, height, px, py) =>{
      if (maxHeight < height) {
        if (this.state.size == 0.5) {
          this.setState({complete: true});
          this.props.onComplete()
        } else {
          this.setState({size: this.state.size -= 0.5, complete: true});
          this.setSize()
        }
      } else {
        if (!this.state.complete) {
          this.setState({
            size: this.state.size += 0.5,
            complete: this.state.size >= this.props.maxSize
          })
          if (this.state.size >= this.props.maxSize) {
            this.props.onComplete()
          }
          this.setSize()
        }
      }
    })
  }
  componentDidMount() {
    this.setSize()
  }

  render() {
    return (
      <Text
        {...this.props}
        ref="field"
        style={[
          this.props.style,
          {
            fontSize: this.state.size,
            color: this.state.complete ? 'black': 'transparent',
            width: this.props.width,
          }
        ]}>
          {this.props.children}
      </Text>
    )
  }
}

TextFit.defaultProps = {
  style:{},
  maxSize: Infinity,
  onComplete: () => {},
};
TextFit.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
  maxSize: PropTypes.number,
  onComplete: PropTypes.func,
};

export default TextFit;
