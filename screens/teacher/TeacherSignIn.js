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

const TeacherSignIn = ({ navigation }) => {
  const [text, setText] = useState("");
  const { toggleTeacher, showloader, setShowloader } = useContext(AuthContext);
  const handleSignin = async (values) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/login",
      { email: values.email, password: values.password, role: "Teacher" },
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
            Alert.alert("Please enter the correct credentials");
            return;
          }
          Alert.alert("Successfully Logged In");
          let { token, user } = dataResponse.data;
          await AsyncStorage.setItem("user_email", user.email);
          await AsyncStorage.setItem("teachToken", token);
          setText("");
          toggleTeacher(true);
        }
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  };
  return (<>
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView>
          <View>
            <Text style={styles.heading}>LOG IN TEACHER</Text>
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
        </ScrollView>
      </View>
    </SafeAreaView>
    {showloader ? <Apploader/> : null}
    </>
  );
};

export default TeacherSignIn;

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
