import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "./Context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer = (props) => {
  const [email, setEmail] = useState("");
  const { signOut } = React.useContext(AuthContext);
  useEffect(async () => {
    const _email = await AsyncStorage.getItem("user_email");
    setEmail(_email);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#192f6a" }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          locations={[0, 0.5, 0.6]}
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={{ padding: 20 }}
        >
          <Image
            source={require("../assets/images/college_logo.jpeg")}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              marginBottom: 5,
            }}
          >
            {email}
          </Text>
        </LinearGradient>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <Pressable
          onPress={signOut}
          android_ripple={{ color: "grey" }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Sign Out
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default CustomDrawer;
