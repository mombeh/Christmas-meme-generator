import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Modal, TextInput } from "react-native";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { captureRef } from "react-native-view-shot";
import OverlayItem from "../../components/OverlayItem";
import TextOverlay from "../../components/TextOverlay";
import ZoomableImage from "../../components/ZoomableImage";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [overlays, setOverlays] = useState<Array<{ id: string; source: any }>>(
    []
  );
  const [showTextModal, setShowTextModal] = useState(false);
  const [tempText, setTempText] = useState("");

  const [textOverlays, setTextOverlays] = useState<
    Array<{ id: string; text: string }>
  >([]);

  const memeRef = useRef<View>(null);

  const overlayOptions = [
    {
      id: "hat",
      label: "Hat",
      source: require("../../assets/overlays/santa-hat.png"),
    },
    {
      id: "beard",
      label: "Beard",
      source: require("../../assets/overlays/santa-beard.png"),
    },
    {
      id: "snow",
      label: "Snow",
      source: require("../../assets/overlays/snowflake.png"),
    },
    {
      id: "lights",
      label: "Lights",
      source: require("../../assets/overlays/christmas-lights.png"),
    },
    {
      id: "tree",
      label: "Tree",
      source: require("../../assets/overlays/christmas-tree.png"),
    },
    {
      id: "gift",
      label: "Gift",
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

  const addText = () => {
    setTextOverlays([
      ...textOverlays,
      { id: Date.now().toString(), text: "Merry Christmas!" },
    ]);
  };

  const exportMeme = async () => {
    if (memeRef.current) {
      const uri = await captureRef(memeRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#8A0000" }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Christmas Meme{"\n"}Generator</Text>

        <View ref={memeRef} style={styles.imageBox}>
          {imageUri ? (
            <ZoomableImage source={{ uri: imageUri }} />
          ) : (
            <Text style={{ color: "gray" }}>Pick an image…</Text>
          )}

          {overlays.map((overlay) => (
            <OverlayItem
              key={overlay.id}
              source={overlay.source}
              initialWidth={120}
              initialHeight={120}
              onDelete={() =>
                setOverlays(overlays.filter((o) => o.id !== overlay.id))
              }
            />
          ))}

          {textOverlays.map((txt) => (
            <TextOverlay
              key={txt.id}
              text={txt.text}
              fontSize={28}
              color="white"
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.goldButton} onPress={pickImage}>
          <Text style={styles.goldButtonText}>PICK IMAGE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goldButton}
          onPress={() => setShowTextModal(true)}
        >
          <Text style={styles.goldButtonText}>ADD TEXT</Text>
        </TouchableOpacity>
        {/* Overlay selector bar */}
       {/* Overlay selector bar */}
<View style={styles.overlayBar}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 10 }}
  >
    {overlayOptions.map((item) => (
      <TouchableOpacity
        key={item.id}
        style={styles.overlayButton}
        onPress={() => addOverlay(item.source)}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#FFF5E6",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={item.source}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
        </View>

        <Text style={styles.overlayLabel}>{item.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

        {/* Text Input Modal */}
        <Modal visible={showTextModal} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Enter Text
              </Text>

              <TextInput
                value={tempText}
                onChangeText={setTempText}
                placeholder="Type something…"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "#8A0000",
                  padding: 12,
                  borderRadius: 10,
                }}
                onPress={() => {
                  if (tempText.trim() !== "") {
                    setTextOverlays([
                      ...textOverlays,
                      { id: Date.now().toString(), text: tempText },
                    ]);
                  }
                  setTempText("");
                  setShowTextModal(false);
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  ADD TEXT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.exportButton} onPress={exportMeme}>
          <Text style={styles.exportText}>EXPORT</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8A0000", // Christmas red background
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    width: "85%",
    color: "#fff",
    marginBottom: 20,
  },

  imageBox: {
    width: "85%",
    height: 350,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  goldButton: {
    width: "85%",
    padding: 15,
    backgroundColor: "#F1D08A",
    borderRadius: 12,
    marginVertical: 6,
  },

  goldButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#8A0000",
  },

  exportButton: {
    width: "85%",
    padding: 15,
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    marginTop: 15,
  },

  exportText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "#8A0000",
  },

  overlayBar: {
    width: "100%",
    paddingVertical: 10,
    marginTop: 10,
  },

  overlayButton: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  overlayLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
