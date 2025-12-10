import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface TextOverlayProps {
  text: string;
  fontSize?: number;
  color?: string;
  liveColor?: string;
  onDelete?: () => void;
  onSelect?: () => void;

  isSelected?: boolean;
  onDeselect?: () => void;
}

export default function TextOverlay({
  text,
  fontSize = 20,
  color = "white",
  liveColor,
  onDelete,
  onSelect,
}: TextOverlayProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastRotation = useSharedValue(0);

  const [showControls, setShowControls] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  const increaseSize = () => setFontScale((prev) => Math.min(prev + 0.1, 4));
  const decreaseSize = () => setFontScale((prev) => Math.max(prev - 0.1, 0.5));

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(() => setShowControls((prev) => !prev))();
    if (onSelect) runOnJS(onSelect)();
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = lastX.value + e.translationX;
      translateY.value = lastY.value + e.translationY;
    })
    .onEnd(() => {
      lastX.value = translateX.value;
      lastY.value = translateY.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = lastScale.value * e.scale;
    })
    .onEnd(() => {
      lastScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = lastRotation.value + e.rotation;
    })
    .onEnd(() => {
      lastRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(tap, pan, pinch, rotate);

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
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        {/* CONTROL BUTTONS */}
        {showControls && (
          <>
            {/* Delete */}
            <TouchableOpacity style={styles.delete} onPress={onDelete}>
              <Text style={styles.btnLabel}>×</Text>
            </TouchableOpacity>

            {/* Increase */}
            <TouchableOpacity
              style={styles.increase}
              onPress={() => runOnJS(increaseSize)()}
            >
              <Text style={styles.btnLabel}>+</Text>
            </TouchableOpacity>

            {/* Decrease */}
            <TouchableOpacity
              style={styles.decrease}
              onPress={() => runOnJS(decreaseSize)()}
            >
              <Text style={styles.btnLabel}>−</Text>
            </TouchableOpacity>
          </>
        )}

        {/* TEXT BOX */}
        <View style={styles.textContainer}>
          <Text
            style={{
              fontSize: fontSize * fontScale,
              color: liveColor ?? color,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {text}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignItems: "center",
  },

  textContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 6,
    backgroundColor: "transparent",
  },

  btnLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  delete: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 22,
    height: 22,
    backgroundColor: "red",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
  },

  increase: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 22,
    height: 22,
    backgroundColor: "#1E90FF",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
  },

  decrease: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 22,
    height: 22,
    backgroundColor: "#1E90FF",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
  },
});
