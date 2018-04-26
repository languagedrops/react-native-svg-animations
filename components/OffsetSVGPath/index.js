import React, {
  PureComponent, Component,
} from 'react';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import {
  Dimensions,
} from 'react-native';
import {
  svgPathProperties,
} from 'svg-path-properties';

import Path from '../AnimatedSVG';

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
  };
  
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    }
    const { d } = this.props;
    const properties = svgPathProperties(d)
    this.length = properties.getTotalLength();
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      offset: nextProps.offset,
    })
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

    } = this.props;
    return (
      <Svg
        height={(height * scale) + 5}
        width={(width * scale) + 5}
      >
        <Path
          strokeDasharray={[this.length, this.length]}
          strokeDashoffset={ (1 - this.state.offset) * this.length}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          scale={scale}
          fill={fill}
          d={d}
          strokeLinecap={lineCap}
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