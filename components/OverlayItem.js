import { Image, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";

export default function OverlayItem({ source, initialWidth = 100, initialHeight = 100 }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastRotation = useSharedValue(0);

 const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = lastX.value + e.translationX;
      translateY.value = lastY.value + e.translationY;
    })
    .onEnd(() => {
      lastX.value = translateX.value;
      lastY.value = translateY.value;
    });

  // PINCH
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = lastScale.value * e.scale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  // ROTATION
  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = lastRotation.value + e.rotation;
    })
    .onEnd(() => {
      lastRotation.value = rotation.value;
    });

  // COMBINE GESTURES
  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <Image
          source={source}
          style={{ width: initialWidth, height: initialHeight }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
  },
});
