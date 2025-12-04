import { StyleSheet } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function OverlayItem({ source, initialWidth = 100, initialHeight = 100 }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => { ctx.startX = translateX.value; ctx.startY = translateY.value; },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    }
  });

  const pinchGesture = useAnimatedGestureHandler({
    onActive: (event) => { scale.value = event.scale; }
  });

  const rotationGesture = useAnimatedGestureHandler({
    onActive: (event) => { rotation.value = event.rotation; }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` }
    ]
  }));

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <RotationGestureHandler onGestureEvent={rotationGesture}>
          <Animated.View>
            <PinchGestureHandler onGestureEvent={pinchGesture}>
              <Animated.Image source={source} style={{ width: initialWidth, height: initialHeight }} />
            </PinchGestureHandler>
          </Animated.View>
        </RotationGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
