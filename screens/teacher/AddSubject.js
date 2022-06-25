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
import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const AddSubject = ({ navigation }) => {
  const { signOut, toggleFlag, showloader, setShowloader } =
    useContext(AuthContext);
  const [text, setText] = useState("");
  const handleSubject = async (values) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/addsubject",
      {
        name: values.name,
        email: values.email,
        code: values.code,
        status: true,
      },
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
          return;
        } else {
          Alert.alert("Successfully added!");
          setText("");
          toggleFlag();
          navigation.pop();
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
              <Text style={styles.heading}>ADD NEW SUBJECT</Text>
            </View>
            <Formik
              initialValues={{
                name: "",
                email: "",
                code: "",
              }}
              onSubmit={(values) => {
                handleSubject(values);
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
                    placeholder="Name of Course"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Enter your E-mail"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Course code"
                    value={values.code}
                    onChangeText={handleChange("code")}
                    defaultValue={text}
                  />
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      ADD
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

export default AddSubject;

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
