import React, { useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import { AuthContext } from "../../components/Context";
import { AntDesign } from "@expo/vector-icons";
const StudentSignup = ({ navigation }) => {
  const { showloader, setShowloader } = useContext(AuthContext);
  const [otpform, setOtpform] = useState(false);
  const [signupform, setSignupform] = useState(true);
  const [userId, setUserId] = useState(null);
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }
  const createTwoButtonAlert = () => {
    Alert.alert(
      "Warning",
      "Once you pressed ok, you won't be able to edit again.",
      [
        {
          text: "Cancel",
          onPress: () => {
            setIsDept(false);
            setNewClass(false);
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setIsDept(false);
            setNewClass(true);
          },
        },
      ]
    );
  };
  const [dept, setDept] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [isDept, setIsDept] = useState(false);
  const [newClass, setNewClass] = useState(false);
  const handleSignup = async (values) => {
    setShowloader(true);
    if (values.email !== "") {
      if (dept !== "Other") {
        values.clas = dept;
      }
      if (dept === "") {
        values.clas = "Computer Science and Engineering";
      }
      if(yearOfStudy !== "") {
        values.yos = yearOfStudy;
      }
      if(yearOfStudy === "") {
        values.yos = "First Year";
      }
      console.log(values.yos);
      var mailformat = "^[A-Za-z0-9._%+-]+@" + "walchandsangli.ac.in" + "$";
      // var mailformat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (values.email.match(mailformat)) {
      } else {
        setShowloader(false);
        Alert.alert("You have entered an invalid email address!");
        return false;
      }
      if (values.password !== "") {
        var passwordFormat =
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/;
        if (values.password.match(passwordFormat)) {
        } else {
          setShowloader(false);
          Alert.alert(
            "Input password having atleast a number, a special character and must be 7-16 characters"
          );
          return false;
        }
        if (values.password !== values.cpassword) {
          setShowloader(false);
          Alert.alert("Reverify password");
          return false;
        }

        //if all values are correct, send data to server
        const res = await APIurl.post(
          "/signup",
          {
            name: values.userName,
            email: values.email,
            phone: values.phone,
            work: values.clas,
            password: values.password,
            role: "Student",
            yearOfStudy: values.yos
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (dataResponse) => {
            setShowloader(false);
            if (
              dataResponse.data.error ||
              !dataResponse.data ||
              dataResponse.data.errors
            ) {
              if (dataResponse.data.errors) {
                Alert.alert(
                  dataResponse.data.errors.email +
                    dataResponse.data.errors.password
                );
                return;
              }
              Alert.alert(dataResponse.data.error);
              Alert.alert("Invalid registration");
            } else {
              if (dataResponse.data.message) {
                if (
                  dataResponse.data.message === "User registered succesfully"
                ) {
                  setUserId(dataResponse.data.user._id);
                  Alert.alert("Please enter the OTP sent to your email.");
                  setSignupform(false);
                  setOtpform(true);
                  return;
                } else {
                  Alert.alert(dataResponse.data.message);
                  navigation.pop();
                  return;
                }
              }
              Alert.alert("Successful registration");
              navigation.pop();
            }
          })
          .catch((error) => {
            setShowloader(false);
            Alert.alert("Server error!");
          });
      } else {
        setShowloader(false);
        Alert.alert("Please fill the fields properly");
      }
    } else {
      setShowloader(false);
      Alert.alert("Please fill the fields properly");
    }
  };

  const handleotpsubmit = async (values) => {
    if (!values.otp1 || !values.otp2 || !values.otp3 || !values.otp4) {
      Alert.alert("Please enter the OTP properly!");
      return;
    }
    const otpstr = values.otp1 + values.otp2 + values.otp3 + values.otp4;
    setShowloader(true);
    const res = await APIurl.post(
      "/verifyEmail",
      {
        userId,
        otp: otpstr,
      },
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
        } else {
          Alert.alert(dataResponse.data.message);
          navigation.pop();
          return;
        }
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          {signupform ? (
            <View style={styles.container}>
              <View>
                <Text style={styles.heading}>Register As Student</Text>
              </View>
              <Formik
                initialValues={{
                  userName: "",
                  email: "",
                  phone: "",
                  clas: "",
                  password: "",
                  cpassword: "",
                  yos: ""
                }}
                onSubmit={(values) => {
                  handleSignup(values);
                }}
              >
                {({ handleChange, handleSubmit, values }) => (
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 20,
                    }}
                  >
                    <Text style={styles.head}>Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      value={values.userName}
                      onChangeText={handleChange("userName")}
                    />
                    <Text style={styles.head}>E-mail</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="E-mail"
                      value={values.email}
                      onChangeText={handleChange("email")}
                    />
                    <Text style={styles.head}>PRN</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="PRN No"
                      value={values.phone}
                      onChangeText={handleChange("phone")}
                    />
                    <Modal visible={isDept} style={styles.container}>
                      <Text style={styles.head}>Stream</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Please enter your Department"
                        value={values.clas}
                        onChangeText={handleChange("clas")}
                      />
                      <Pressable
                        style={[{ backgroundColor: "#007bff" }, styles.button]}
                        onPress={() => {
                          if (values.clas) {
                            createTwoButtonAlert();
                          } else {
                            Alert.alert("Please fill the field properly");
                          }
                        }}
                        android_ripple={{ color: "black" }}
                      >
                        <Text style={[{ color: "white" }, styles.buttonText]}>
                          OK
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[{ backgroundColor: "red" }, styles.button]}
                        onPress={() => {
                          setIsDept(false);
                          setNewClass(false);
                        }}
                        android_ripple={{ color: "black" }}
                      >
                        <Text style={[{ color: "white" }, styles.buttonText]}>
                          CANCEL
                        </Text>
                      </Pressable>
                    </Modal>
                    <Text style={styles.head}>Stream</Text>
                    <View style={styles.input}>
                      <Picker
                        enabled={!newClass}
                        ref={pickerRef}
                        selectedValue={dept}
                        onValueChange={(itemValue, itemIndex) => {
                          setDept(itemValue);
                          if (itemValue == "Other") {
                            setIsDept(true);
                          }
                        }}
                      >
                        <Picker.Item
                          label="Computer Science and Engineering"
                          value="Computer Science and Engineering"
                        />
                        <Picker.Item
                          label="Information Technology"
                          value="Information Technology"
                        />
                        <Picker.Item label="Electronics" value="Electronics" />
                        <Picker.Item label="Electrical" value="Electrical" />
                        <Picker.Item label="Mechanical" value="Mechanical" />
                        <Picker.Item label="Civil" value="Civil" />
                        <Picker.Item label="Other" value="Other" />
                      </Picker>
                    </View>
                    <Text style={styles.head}>Year of Study</Text>
                    <View style={styles.input}>
                      <Picker
                        enabled={true}
                        ref={pickerRef}
                        selectedValue={yearOfStudy}
                        onValueChange={(itemValue, itemIndex) => {
                          setYearOfStudy(itemValue);
                        }}
                      >
                        <Picker.Item label="First Year" value="First Year" />
                        <Picker.Item label="Second Year" value="Second Year" />
                        <Picker.Item label="Third Year" value="Third Year" />
                        <Picker.Item label="Final Year" value="Final Year" />
                      </Picker>
                    </View>
                    <Text style={styles.head}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry={true}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      password="true"
                    />
                    <Text style={styles.head}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      secureTextEntry={true}
                      value={values.cpassword}
                      onChangeText={handleChange("cpassword")}
                      password="true"
                    />
                    <Pressable
                      style={[{ backgroundColor: "#007bff" }, styles.button]}
                      onPress={handleSubmit}
                      android_ripple={{ color: "black" }}
                    >
                      <Text style={[{ color: "white" }, styles.buttonText]}>
                        SIGNUP
                      </Text>
                    </Pressable>
                  </View>
                )}
              </Formik>
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
      </SafeAreaView>
      {otpform ? (
        <View>
          <Formik
            initialValues={{
              otp1: "",
              otp2: "",
              otp3: "",
              otp4: "",
            }}
            onSubmit={(values) => {
              handleotpsubmit(values);
            }}
          >
            {({ handleChange, handleSubmit, values }) => (
              <View style={{ marginTop: 100 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 20,
                    fontSize: 26,
                  }}
                >
                  ENTER OTP
                </Text>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    marginBottom: 20,
                    borderColor: "grey",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextInput
                    style={styles.otpinput}
                    placeholder="_"
                    maxLength={1}
                    value={values.clas}
                    onChangeText={handleChange("otp1")}
                  />
                  <TextInput
                    style={styles.otpinput}
                    placeholder="_"
                    maxLength={1}
                    value={values.clas}
                    onChangeText={handleChange("otp2")}
                  />
                  <TextInput
                    style={styles.otpinput}
                    placeholder="_"
                    maxLength={1}
                    value={values.clas}
                    onChangeText={handleChange("otp3")}
                  />
                  <TextInput
                    style={styles.otpinput}
                    placeholder="_"
                    maxLength={1}
                    value={values.clas}
                    onChangeText={handleChange("otp4")}
                  />
                </View>
                <Pressable
                  style={[{ backgroundColor: "#007bff" }, styles.button]}
                  onPress={handleSubmit}
                  android_ripple={{ color: "black" }}
                >
                  <AntDesign name="checkcircleo" size={24} color="black" />
                </Pressable>
              </View>
            )}
          </Formik>
        </View>
      ) : (
        <></>
      )}

      {showloader ? <Apploader /> : null}
    </>
  );
};

export default StudentSignup;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f1d5",
    marginTop: 20,
    marginBottom: 40,
  },
  otpinput: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 14,
    borderRadius: 6,
    textAlign: "center",
  },
  head: {
    fontWeight: "bold",
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
    marginTop: 10,
    width: "50%",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
