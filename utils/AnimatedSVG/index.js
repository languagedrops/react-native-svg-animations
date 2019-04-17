import {
  Animated,
} from 'react-native';
import AnimatedSVGPropString from '../AnimatedSVGPropString';
import AnimatedSVGState from '../AnimatedSVGState';
import AnimatedSVGTransform from '../AnimatedSVGTransform';

function AnimatedSVG (Component, {
  state, propString, keepXY
} = {}) {
  Component = AnimatedSVGState(Component, state);
  Component = AnimatedSVGPropString(Component, propString);
  Component = AnimatedSVGTransform(Component, { keepXY });
  Component = Animated.createAnimatedComponent(Component);
  return Component;
}

export default AnimatedSVG;
