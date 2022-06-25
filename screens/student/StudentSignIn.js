import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions
} from "react-native";

import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const StudentSignIn = ({ navigation }) => {
  const [text, setText] = useState("");
  const { toggleStudent, showloader, setShowloader } = useContext(AuthContext);
  const handleSignin = async (values) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/login",
      { email: values.email, password: values.password, role: "Student" },
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
          Alert.alert("Unsuccessful login");
          return;
        } else {
          if (dataResponse.data.errors) {
            Alert.alert("Please enter the correct the credentials");
            navigation.navigate("StudentSignup");
            return;
          }
          Alert.alert("Successfully Logged In");
          let { token, user } = dataResponse.data;
          console.log(token);
          await AsyncStorage.setItem("user_email", user.email);
          await AsyncStorage.setItem("stuToken", token);
          setText("");
          toggleStudent(true);
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
              <Text style={styles.heading}>LOG IN STUDENT</Text>
            </View>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values) => {
                handleSignin(values);
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
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Password"
                    secureTextEntry={true}
                    password="true"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    defaultValue={text}
                  />
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      paddingRight: 20,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      navigation.navigate("StudentSignup");
                    }}
                    android_ripple={{ color: "grey" }}
                  >
                    <Text style={{ color: "blue", fontSize: 14 }}>
                      SIGNUP AS STUDENT
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      LOGIN
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
            <View>
              <Pressable
                style={[
                  { backgroundColor: "#8200d6", width: "100%" },
                  styles.button,
                ]}
                onPress={() => navigation.navigate("TeacherSignIn")}
                android_ripple={{ color: "black" }}
              >
                <Text style={[{ color: "white" }, styles.buttonText]}>
                  Not a Student?
                </Text>
                <Text style={[{ color: "white" }, styles.buttonText]}>
                  Log in as Teacher...
                </Text>
              </Pressable>
            </View>
            <View>
              <Pressable
                style={{
                  marginTop: 10,
                  alignSelf: "center",
                }}
                onPress={() => {
                  navigation.navigate("ForgotPassword");
                }}
                android_ripple={{ color: "grey" }}
              >
                <Text style={{ color: "black", fontSize: 14 }}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default StudentSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f1d5",
    marginTop: 30,
    marginBottom: 30,
    height: Dimensions.get('window').height
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
