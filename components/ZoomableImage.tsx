// components/ZoomableImage.tsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface ZoomableImageProps {
  source: any; // or ImageSourcePropType if you want strict typing
}

export default function ZoomableImage({ source }: ZoomableImageProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.Image
          source={source}
        resizeMode="cover"   // ⭐ change to cover so it fills the card!
        style={[
          { width: "100%", height: "100%" }, // ⭐ remove fixed height
          animatedStyle,
        ]}
      />
    </GestureDetector>
  );
}
