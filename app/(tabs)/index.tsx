import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import OverlayItem from "../../components/OverlayItem";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [overlays, setOverlays] = useState<Array<{ id: string; source: any }>>(
    []
  );
  const [textOverlays, setTextOverlays] = useState<
    Array<{ id: string; text: string }>
  >([]);
  const [newText, setNewText] = useState("");
  const memeRef = useRef<View>(null);
  // Inside /app/(tabs)/index.tsx, near the top
  const overlayOptions = [
    {
      id: "santa-hat",
      label: "Santa Hat",
      source: require("../../assets/overlays/santa-hat.png"),
    },
    {
      id: "santa-beard",
      label: "Santa Beard",
      source: require("../../assets/overlays/santa-beard.png"),
    },
    {
      id: "snowflake",
      label: "Snowflake",
      source: require("../../assets/overlays/snowflake.png"),
    },
    {
      id: "christmas-lights",
      label: "Christmas Lights",
      source: require("../../assets/overlays/christmas-lights.png"),
    },
    {
      id: "christmas-tree",
      label: "Christmas Tree",
      source: require("../../assets/overlays/christmas-tree.png"),
    },
    {
      id: "gift-box",
      label: "Gift Box",
      source: require("../../assets/overlays/gift-box.png"),
    },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const addOverlay = (source: any) => {
    setOverlays([...overlays, { id: Date.now().toString(), source }]);
  };

  const addTextOverlay = () => {
    if (!newText.trim()) return;
    setTextOverlays([
      ...textOverlays,
      { id: Date.now().toString(), text: newText },
    ]);
    setNewText("");
  };

  const exportMeme = async () => {
    if (memeRef.current) {
      const uri = await captureRef(memeRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Canvas */}
      <View ref={memeRef} style={styles.canvas}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {overlays.map((overlay) => (
          <OverlayItem
            key={overlay.id}
            source={overlay.source}
            initialWidth={80}
            initialHeight={80}
          />
        ))}
        {textOverlays.map((txt, i) => (
          <Text key={txt.id} style={[styles.textOverlay, { top: 10 + i * 30 }]}>
            {txt.text}
          </Text>
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Pick Base Image" onPress={pickImage} />

        <ScrollView
          horizontal
          style={styles.overlayScroll}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {overlayOptions.map((overlay) => (
            <Button
              key={overlay.id}
              title={overlay.label}
              onPress={() => addOverlay(overlay.source)}
            />
          ))}
        </ScrollView>

        <TextInput
          value={newText}
          onChangeText={setNewText}
          placeholder="Enter text"
          style={styles.textInput}
        />
        <Button title="Add Text" onPress={addTextOverlay} />

        <TouchableOpacity style={styles.exportButton} onPress={exportMeme}>
          <Text style={styles.exportButtonText}>Export Meme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  canvas: {
    flex: 1,
    width: screenWidth,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 300, height: 300 },
  textOverlay: {
    position: "absolute",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  controls: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  overlayScroll: { marginVertical: 10 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#000",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  exportButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  exportButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
