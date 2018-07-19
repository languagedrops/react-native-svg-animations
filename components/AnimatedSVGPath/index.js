import React, { Component,
} from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {
  svgPathProperties,
} from 'svg-path-properties';
import * as Device from 'react-native-device-info'

import Path from '../AnimatedSVG';

const isAndroid = Platform.OS === 'android'
const isAndriod7 = Device.getAPILevel() > 23 && Device.getAPILevel() < 26
const { height, width } = Dimensions.get('window');
class AnimatedSVGPath extends Component {
  static propTypes = {
    d: PropTypes.string.isRequired,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    duration: PropTypes.number,
    height: PropTypes.number,
    delay: PropTypes.number,
    width: PropTypes.number,
    scale: PropTypes.number,
    fill: PropTypes.string,
    loop: PropTypes.bool,
    lineCap: PropTypes.string,
    shouldReload: PropTypes.number,
    animationLimit: PropTypes.number,
    animationDuration: PropTypes.number,
    lineJoin: PropTypes.string,
  };

  static defaultProps = {
    strokeColor: "black",
    strokeWidth: 1,
    duration: 1000,
    delay: 1000,
    fill: "none",
    scale: 1,
    height,
    width,
    loop: true,
    lineCap: "butt",
    shouldReload: 0,
    animationLimit: 0,
    animationDuration: 1000,
    lineJoin: "miter",
  };

  static getDerivedStateFromProps(newProps, prevState) {
    const newDashLength = svgPathProperties(newProps.d).getTotalLength() + newProps.strokeWidth
    if (newDashLength !== prevState.dashLength) {
      return {
        dashLength: newDashLength,
        strokeDashOffset: new Animated.Value(newDashLength),
      }
    } else {
      return null
    }
  }

  constructor(props) {
    super(props);
    const { d, strokeWidth } = this.props;
    const dashLength = svgPathProperties(d).getTotalLength() + strokeWidth
    this.isAnimating = false;
    this.state = {
      strokeDashOffset: new Animated.Value(dashLength),
      dashLength
    }
  }

  animate = () => {
    const {
      delay,
      duration,
      loop,
      velocity,
      animationLimit,
    } = this.props;
    this.isAnimating = true
    this.state.strokeDashOffset.setValue(this.state.dashLength);
    let animationDuration = duration
    if (velocity) {
      animationDuration = velocity * this.state.dashLength
    }
    let endValue = 0
    if (animationLimit !== 0) {
      endValue = this.state.dashLength * (1 - animationLimit)
      animationDuration = this.props.animationDuration
    }
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.state.strokeDashOffset, {
        toValue: endValue,
        duration: animationDuration,
      })
    ]).start(() => {
      if (loop) {
          this.animate();
      }
      this.isAnimating = false;
    });
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldReload !== this.props.shouldReload && this.isAnimating === false) {
      this.animate();
    }
  }

  render() {
    const {
      d,
      fill,
      scale,
      width,
      height,
      strokeColor,
      strokeWidth,
      lineCap,
      lineJoin,
    } = this.props;
    const { dashLength, strokeDashOffset } = this.state
    const varDashLength = (isAndriod7 && isAndroid) ? (dashLength - strokeWidth) : dashLength
    return (
      <Svg
        height={(height * scale) + 5}
        width={(width * scale) + 5}
      >
        <Path
          strokeDasharray={[varDashLength, dashLength]}
          strokeDashoffset={strokeDashOffset}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          scale={scale}
          fill={fill}
          d={d}
          strokeLinecap={lineCap}
          strokeLinejoin={ lineJoin }
        />
      </Svg>
    );
  }
}

/* Export ==================================================================== */

module.exports = AnimatedSVGPath;
module.exports.details = {
  title: 'AnimatedSVGPath',
};
