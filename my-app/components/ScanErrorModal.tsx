import { ThemedText } from "@/components/themed-text";

import { ThemedView } from "@/components/themed-view";

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ScanErrorModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const ScanErrorModal: React.FC<ScanErrorModalProps> = ({
  visible,
  onClose,
  message,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalBackground}>
        <ThemedView style={styles.modalContainer}>
          <MaterialIcons name="error" size={60} color="red" />
          {/* <MdError size={60} color="red" /> */}
          <ThemedText style={styles.modalTitle}>Scan Failed</ThemedText>
          <ThemedText style={styles.modalText}>{message}</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default ScanErrorModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    // backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
