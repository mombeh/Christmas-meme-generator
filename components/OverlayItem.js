import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function OverlayItem({
  source,
  initialWidth = 100,
  initialHeight = 100,
  onDelete, // ⭐ REQUIRED
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastRotation = useSharedValue(0);

  const [showDelete, setShowDelete] = useState(false);

  // TAP → show delete button
  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(setShowDelete)(true);
  });

  // DRAG
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

  // COMBINE EVERYTHING
  const composed = Gesture.Simultaneous(pan, pinch, rotate, tap);

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
        
        {showDelete && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
        )}

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
  deleteBtn: {
    position: "absolute",
    right: -12,
    top: -12,
    backgroundColor: "red",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
});
