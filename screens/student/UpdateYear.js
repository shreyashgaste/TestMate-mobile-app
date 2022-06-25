import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { Formik } from "formik";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import { Picker } from "@react-native-picker/picker";

const UpdateYear = ({ navigation }) => {
  const { signOut, showloader, setShowloader } =
    useContext(AuthContext);
  const [text, setText] = useState("");
  const [currentYearOfStudy, setCurrentYearOfStudy] = useState("");
  const [nextYearOfStudy, setNextYearOfStudy] = useState("");

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }
  const handleUpdate = async (values) => {
    setShowloader(true);
    if (values.prn.trim() === "") {
      setShowloader(false);
      Alert.alert("Please enter your PRN");
      return;
    }
    if (currentYearOfStudy === nextYearOfStudy) {
      setShowloader(false);
      Alert.alert("Invalid Request!!");
      return;
    }
    if (currentYearOfStudy === "") {
      values.cyos = "First Year";
    } else {
      values.cyos = currentYearOfStudy;
    }
    if (nextYearOfStudy === "") {
      values.nyos = "First Year";
    } else {
      values.nyos = nextYearOfStudy;
    }

    const res = await APIurl.post(
      "/requestUpgrade",
      {
          prn: values.prn.trim(),
          currentYear: values.cyos,
          nextYear: values.nyos
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("stuToken")),
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
          return;
        } else {
          Alert.alert(dataResponse.data.message);
          setText("");
        }
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ScrollView>
            <View>
              <Text style={styles.heading}>Update Year of Study</Text>
            </View>
            <Formik
              initialValues={{
                prn: "",
                cyos: "",
                nyos: "",
              }}
              onSubmit={(values) => {
                handleUpdate(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="PRN No"
                    value={values.prn}
                    onChangeText={handleChange("prn")}
                    defaultValue={text}
                  />
                  <Text>Current Year of Study</Text>
                  <View style={styles.input}>
                    <Picker
                      enabled={true}
                      ref={pickerRef}
                      selectedValue={currentYearOfStudy}
                      onValueChange={(itemValue, itemIndex) => {
                        setCurrentYearOfStudy(itemValue);
                      }}
                    >
                      <Picker.Item label="First Year" value="First Year" />
                      <Picker.Item label="Second Year" value="Second Year" />
                      <Picker.Item label="Third Year" value="Third Year" />
                      <Picker.Item label="Final Year" value="Final Year" />
                    </Picker>
                  </View>
                  <Text>Next Year of Study</Text>
                  <View style={styles.input}>
                    <Picker
                      enabled={true}
                      ref={pickerRef}
                      selectedValue={nextYearOfStudy}
                      onValueChange={(itemValue, itemIndex) => {
                        setNextYearOfStudy(itemValue);
                      }}
                    >
                      <Picker.Item label="First Year" value="First Year" />
                      <Picker.Item label="Second Year" value="Second Year" />
                      <Picker.Item label="Third Year" value="Third Year" />
                      <Picker.Item label="Final Year" value="Final Year" />
                    </Picker>
                  </View>
                  <Pressable
                    style={[{ backgroundColor: "#8ed862" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      UPDATE
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default UpdateYear;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f1d5",
    marginTop: 30,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    height: 60,
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
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  datebutton: {
    width: "50%",
    borderColor: "#fff",
    borderWidth: 2,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 4,
  },
  dateview: {
    flexDirection: "row",
    margin: 10,
  },
  datetext: {
    color: "#fff",
    fontSize: 14,
  },
});
