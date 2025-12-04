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

  // PAN (move)
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    });

  // PINCH (scale)
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  // ROTATION
  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
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
