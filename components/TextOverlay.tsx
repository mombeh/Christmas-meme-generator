// File: /components/TextOverlay.tsx
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

interface TextOverlayProps {
  text: string;
  fontSize?: number;
  color?: string;
}

export default function TextOverlay({
  text,
  fontSize = 20,
  color = "white",
}: TextOverlayProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // PAN gesture
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    });

  // PINCH gesture
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  // ROTATION gesture
  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
    });

  // Combine gestures
  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  // Animated style
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
      <Animated.Text
        style={[
          styles.text,
          { fontSize, color },
          animatedStyle,
        ]}
      >
        {text}
      </Animated.Text>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  text: {
    position: "absolute",
    fontWeight: "bold",
  },
});
