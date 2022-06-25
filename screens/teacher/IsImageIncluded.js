import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const IsImageIncuded = ({ route, navigation }) => {
  const { signOut, showloader, setShowloader } =
    useContext(AuthContext);
  const { subjectName } = route.params;
  const handleSubmit = async () => {
    setShowloader(true);
    const res = await APIurl.post(
      "/blankquestion",
      { ispermission: true, subjectName },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("teachToken")),
        },
      }
    )
      .then(async (dataResponse) => {
        setShowloader(false);
        if (dataResponse.data.error) {
          if (dataResponse.data.error === "You must be logged in") {
            Alert.alert("Please log in again");
            signOut();
            return;
          }
          Alert.alert(dataResponse.data.error);
          Alert.alert("Process unsuccessful");
          return;
        } else {
          navigation.navigate("AddQuestionImage", {
            questionId: dataResponse.data.data._id,
          });
        }
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.head}>Tell Us More</Text>
        <Text style={styles.para}>
          Are you going to add any image for question or options or answer?
        </Text>
        <Pressable
          style={[{ backgroundColor: "#007bff" }, styles.button]}
          onPress={handleSubmit}
          android_ripple={{ color: "black" }}
        >
          <Text style={[{ color: "white" }, styles.buttonText]}>YES</Text>
        </Pressable>
        <Pressable
          style={[{ backgroundColor: "red" }, styles.button]}
          onPress={() => navigation.navigate("AddQuestion", { subjectName })}
          android_ripple={{ color: "black" }}
        >
          <Text style={[{ color: "white" }, styles.buttonText]}>NO</Text>
        </Pressable>
      </View>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default IsImageIncuded;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  para: {
    textAlign: "center",
    paddingHorizontal: 10,
    fontSize: 18,
  },
  head: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
