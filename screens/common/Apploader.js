import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const Apploader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView source={require("../../assets/loader.json")} autoPlay loop />
    </View>
  );
};

export default Apploader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
});
