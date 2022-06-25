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
import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const ForgotPassword = () => {
  const { showloader, setShowloader } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const handleForgotPassword = async (values) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/forgotPassword",
      { email: values.email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (dataResponse) => {
        setShowloader(false);
        if (dataResponse.data.error) {
          Alert.alert(dataResponse.data.error);
          return;
        }
        if (dataResponse.data.message) {
          setMessage(dataResponse.data.message);
        }
        setText("");
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
              <Text style={styles.heading}>Please Enter Your Email</Text>
            </View>
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={(values) => {
                handleForgotPassword(values);
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
                    placeholder="E-mail"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    defaultValue={text}
                  />
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
            {message ? (
              <Text style={[styles.heading, { color: "green", fontSize: 18 }]}>
                {message}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default ForgotPassword;

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
