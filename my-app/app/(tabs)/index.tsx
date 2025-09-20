// import { Image } from "expo-image";
// import { Platform, StyleSheet } from "react-native";

// import { HelloWave } from "@/components/hello-wave";
// import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { Link } from "expo-router";

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome Home!</ThemedText>
//         <HelloWave />
//         <Image
//           source={require("@/assets/images/app_logo.png")}
//           style={{ height: 24, width: 39 }}
//         />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
//           to see changes. Press{" "}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: "cmd + d",
//               android: "cmd + m",
//               web: "F12",
//             })}
//           </ThemedText>{" "}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction
//               title="Action"
//               icon="cube"
//               onPress={() => alert("Action pressed")}
//             />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert("Share pressed")}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert("Delete pressed")}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">
//             npm run reset-project
//           </ThemedText>{" "}
//           to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
//           directory. This will move the current{" "}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });

import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import React, { useContext, useEffect, useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useProgram } from "../hooks/ProgramContext";
// import { EXPO_PUBLIC_API_URL } from "@env";

interface Program {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function HomeScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(cameraPermission?.granted);
  const [data, setData] = useState<Program[]>([]);
  const { selectedProgramId, setSelectedProgramId } = useProgram();

  const fetchData = async () => {
    try {
      const response = await axios.get<Program[]>(
        // `${process.env.EXPO_PUBLIC_API_URL}/programs`
        `${process.env.EXPO_PUBLIC_API_URL_LOCAL}/programs`
      );
      setData(response.data);
      // Set default selected ID to the first program if none is selected
      if (response.data.length > 0 && !selectedProgramId) {
        setSelectedProgramId(response.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.heading}>
          🎟️ Welcome
        </ThemedText>
        <ThemedText style={styles.subtext}>
          Manage your program passes easily and securely.
        </ThemedText>

        <Picker
          selectedValue={selectedProgramId}
          onValueChange={(itemValue: string) => setSelectedProgramId(itemValue)}
          style={styles.picker}
        >
          {data.map((program) => (
            <Picker.Item
              key={program._id}
              label={program.name}
              value={program._id}
            />
          ))}
        </Picker>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={requestCameraPermission}
        >
          <ThemedText style={styles.buttonText}>
            {isPermissionGranted ? "Camera Ready ✅" : "Enable Camera"}
          </ThemedText>
        </TouchableOpacity>

        {/* <Link href="../scanner" asChild>
          <TouchableOpacity
            style={[styles.button, !isPermissionGranted && styles.disabled]}
            disabled={!isPermissionGranted}
          >
            <ThemedText style={styles.buttonText}>Scan Code</ThemedText>
          </TouchableOpacity>
        </Link> */}

        <Link href="../scan" asChild>
          <TouchableOpacity
            style={[styles.button, !isPermissionGranted && styles.disabled]}
            disabled={!isPermissionGranted} // Disable if no program is selected
          >
            <ThemedText style={styles.buttonText}>Scan Code</ThemedText>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    // backgroundColor: "#f9fafb",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonPrimary: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  picker: { height: 200, width: "100%" },
  button: {
    backgroundColor: "#4b5563",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    // color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: {
    backgroundColor: "#9ca3af",
  },
});
