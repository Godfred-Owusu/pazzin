import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";

import { ThemedView } from "@/components/themed-view";

interface ScanResultModalProps {
  visible: boolean;
  onClose: () => void;
  result: {
    name: string;
    email: string;
    message: string;
  } | null;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({
  visible,
  onClose,
  result,
}) => {
  if (!result) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalBackground}>
        <ThemedView style={styles.modalContainer}>
          {/* <MaterialIcons name="done" size={60} color="green" /> */}
          <ThemedText style={styles.modalTitle}>Scan Successful!</ThemedText>
          <ThemedText style={styles.modalText}>Name: {result.name}</ThemedText>
          <ThemedText style={styles.modalText}>
            Email: {result.email}
          </ThemedText>
          <ThemedText style={styles.modalText}>{result.message}</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default ScanResultModal;

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
    backgroundColor: "green",
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
