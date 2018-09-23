import React, {
  PureComponent, Component,
} from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  Dimensions,
  Platform,
} from 'react-native';
import {
  svgPathProperties,
} from 'svg-path-properties';
import Device from 'react-native-simple-device-info'
import Path from '../AnimatedSVG';
const isAndroid = Platform.OS === 'android'

const isAndriod7 = Device.getAPILevel() > 23 && Device.getAPILevel() < 26
const { height, width } = Dimensions.get('window');
class OffsetSVGPath extends Component {
  static propTypes = {
    d: PropTypes.string.isRequired,
    offset: PropTypes.number.isRequired,
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
    offset: 0,
    lineJoin: "miter"
  };

  static getDerivedStateFromProps(newProps, prevState) {
    const newLength = svgPathProperties(newProps.d).getTotalLength()
    if (newLength !== prevState.length) {
      return { length: newLength }
    } else {
      return null
    }
  }

  constructor(props) {
    super(props);
    const { d } = this.props;
    const properties = svgPathProperties(d)
    this.state = {
      length: properties.getTotalLength()
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
      offset,
      lineJoin,
    } = this.props
    const { length } = this.state
    const dashLength = length + strokeWidth
    const varDashLength = (isAndriod7 && isAndroid) ? (dashLength - strokeWidth) : dashLength
    const varDashOffset = (isAndriod7 && isAndroid) ? (dashLength - (strokeWidth / 1.1)) : dashLength
    return (
      <Svg
        height={(height * scale) + 5}
        width={(width * scale) + 5}
      >
        <Path
          strokeDasharray={[varDashLength, dashLength]}
          strokeDashoffset={ varDashOffset - offset * length}
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

module.exports = OffsetSVGPath;
module.exports.details = {
  title: 'OffsetSVGPath',
};
