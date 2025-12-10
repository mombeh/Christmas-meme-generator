import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface OverlayItemProps {
  source: any;
  initialWidth?: number;
  initialHeight?: number;
  onDelete?: () => void;

  // NEW
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
}

export default function OverlayItem({
  source,
  initialWidth = 100,
  initialHeight = 100,
  onDelete,
  isSelected = false,
  onSelect,
  onDeselect,
}: OverlayItemProps) {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastRotation = useSharedValue(0);

  const [showControls, setShowControls] = useState(false);

  // TAP → toggle controls
  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(setShowControls)(s => !s);
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

  // PINCH (Zoom)
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = lastScale.value * e.scale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  // ROTATION gesture
  const rotateGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = lastRotation.value + e.rotation;
    })
    .onEnd(() => {
      lastRotation.value = rotation.value;
    });

  // COMBINE
  const composed = Gesture.Simultaneous(pan, pinch, rotateGesture, tap);

  // Manual resize button action
  const resizeManual = () => {
    scale.value = scale.value + 0.15;
    lastScale.value = scale.value;
  };

  // Manual rotate button action
  const rotateManual = () => {
    rotation.value = rotation.value + (15 * Math.PI) / 180; // rotate 15°
    lastRotation.value = rotation.value;
  };

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

        {/* DELETE BUTTON */}
        {showControls && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.iconText}>X</Text>
          </TouchableOpacity>
        )}

        {/* ROTATE BUTTON */}
        {showControls && (
          <TouchableOpacity style={styles.rotateBtn} onPress={rotateManual}>
            <Text style={styles.iconText}>⟳</Text>
          </TouchableOpacity>
        )}

        {/* RESIZE BUTTON */}
        {showControls && (
          <TouchableOpacity style={styles.resizeBtn} onPress={resizeManual}>
            <Text style={styles.iconText}>↔</Text>
          </TouchableOpacity>
        )}

        {/* IMAGE */}
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

  iconText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  deleteBtn: {
    position: "absolute",
    right: -20,
    top: -20,
    backgroundColor: "red",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  rotateBtn: {
    position: "absolute",
    left: -20,
    top: -20,
    backgroundColor: "#1E90FF",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  resizeBtn: {
    position: "absolute",
    right: -20,
    bottom: -20,
    backgroundColor: "#32CD32",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
});
