import React, { useState, useRef, useEffect, useContext } from "react";
import ScanErrorModal from "@/components/ScanErrorModal";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import axios from "axios";
import ScanResultModal from "@/components/ScanResultModal";

import { useProgram } from "../../hooks/ProgramContext";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Home() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const scanLock = useRef(false);
  const [count, setCount] = useState(0);

  const { selectedProgramId } = useProgram();

  const verifyScan = async (data: string) => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/participants/verify/${data}/${selectedProgramId}`;
      //
      console.log("[verifyScan] POST URL:", url);
      console.log("[verifyScan] POST data:", data);
      const response = await axios.post(url);
      console.log("[verifyScan] response status:", response.status);
      setCount((prev) => prev + 1);
      console.log(`${count}`);

      return response.data; // return server response
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        const { status, data } = error.response;
        // console.warn("[verifyScan] server error:", status, data);

        if (status === 404) {
          throw new Error("Invalid QR code");
        }
        if (status === 409) {
          // assuming the backend sends a message like `${user.name} already claimed`
          throw new Error(data?.message || "Already claimed");
        }

        // fallback for other server errors
        throw new Error(data?.message || "Server error");
      } else {
        // network or Axios internal error
        // console.error("[verifyScan] network/error:", error);
        throw new Error(error.message || "Network error");
      }
    }
  };

  //   const [facing, setFacing] = useState<CameraType>("back");
  //   const [permission, requestPermission] = useCameraPermissions();
  //   const [scanned, setScanned] = useState(false);

  // synchronous lock
  //   const scanLock = useRef(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({ data }: BarcodeScanningResult) => {
    if (scanLock.current) return; // block extra fires
    scanLock.current = true;

    setScanned(true);
    // Alert.alert("Scanned Data", data);
    // try {
    //   const result = await verifyScan(data);
    //   console.log("[handleScan] verifyScan result:", result);
    //   Alert.alert("Server Response", JSON.stringify(result));
    // } catch (err: any) {
    //   console.error("[handleScan] error:", err);
    //   Alert.alert("Error", err.message);
    // }

    try {
      const result = await verifyScan(data);
      setScanResult(result);
      setModalVisible(true);
    } catch (err: any) {
      //   console.error("[handleScan] error:", err);
      setErrorMessage(err.message || "Something went wrong");
      setErrorModalVisible(true);
      // scanLock.current = false;
      // setScanned(false);
    }
  };

  const resetScan = () => {
    scanLock.current = false;
    setScanned(false);
    setModalVisible(false);
    setScanResult(null);
  };

  const toggleCameraFacing = () =>
    setFacing((prev) => (prev === "back" ? "front" : "back"));

  return (
    // <ThemedView>
    <View style={styles.container}>
      {/* trial */}
      <ThemedText
        style={{
          backgroundColor: "red",
          fontSize: 9,
          paddingTop: 50,
          textAlign: "center",
          color: "white",
        }}
      >
        {selectedProgramId}
      </ThemedText>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
      <ScanResultModal
        visible={modalVisible}
        onClose={resetScan}
        result={scanResult}
      />

      <ScanErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />

      {/* Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.scanArea} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer} pointerEvents="box-none">
        {scanned ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={resetScan}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    // </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: "center", marginBottom: 20 },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
});
