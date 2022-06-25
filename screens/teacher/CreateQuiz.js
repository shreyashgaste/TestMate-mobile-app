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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const CreateQuiz = ({ navigation }) => {
  const { signOut, toggleFlag, showloader, setShowloader } =
    useContext(AuthContext);
  const [text, setText] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [startshow, setStartShow] = useState(false);
  const [endshow, setEndShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startdate;
    if (startshow) {
      setStartShow(Platform.OS === "ios");
      setStartDate(currentDate);
    }
    if (endshow) {
      setEndShow(Platform.OS === "ios");
      setEndDate(currentDate);
    }
  };

  function showDatepicker(datestatus) {
    if (datestatus === "start") setStartShow(true);
    if (datestatus === "end") setEndShow(true);
    setMode("date");
  }

  function showTimepicker(datestatus) {
    if (datestatus === "start") setStartShow(true);
    if (datestatus === "end") setEndShow(true);
    setMode("time");
  }

  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }
  const handleQuiz = async (values) => {
    setShowloader(true);
    if (!values.quizName.trim()) {
      Alert.alert("Please enter the quiz name...");
      setShowloader(false);
      return;
    }
    if (!values.subjectName.trim()) {
      Alert.alert("Please enter the subject...");
      setShowloader(false);
      return;
    }
    if (!values.passcode.trim()) {
      Alert.alert("Please enter the passcode...");
      setShowloader(false);
      return;
    }
    if (!values.duration.trim()) {
      Alert.alert("Please enter the duration...");
      setShowloader(false);
      return;
    }
    if (yearOfStudy !== "") {
      values.yos = yearOfStudy;
    }
    if (yearOfStudy === "") {
      values.yos = "First Year";
    }

    const email = await AsyncStorage.getItem("user_email");
    const res = await APIurl.post(
      "/createquiz",
      {
        quizName: values.quizName,
        subjectName: values.subjectName,
        passcode: values.passcode,
        starttime: startdate,
        endtime: enddate,
        email,
        duration: values.duration,
        year: values.yos
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
              <Text style={styles.heading}>CREATE A QUIZ</Text>
            </View>
            <Formik
              initialValues={{
                quizName: "",
                subjectName: "",
                passcode: "",
                duration: "",
                yos: "",
              }}
              onSubmit={(values) => {
                handleQuiz(values);
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
                    placeholder="Quiz Name"
                    value={values.quizName}
                    onChangeText={handleChange("quizName")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Subject Name"
                    value={values.subjectName}
                    onChangeText={handleChange("subjectName")}
                    defaultValue={text}
                  />
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
                      <Picker.Item label="All Year" value="All Year" />
                    </Picker>
                  </View>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Passcode"
                    value={values.passcode}
                    onChangeText={handleChange("passcode")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Duration in minutes"
                    value={values.duration}
                    onChangeText={handleChange("duration")}
                    defaultValue={text}
                  />
                  <View style={styles.dateview}>
                    <Pressable
                      onPress={() => {
                        showDatepicker("start");
                      }}
                      style={styles.datebutton}
                    >
                      <Text style={styles.datetext}>Start Date</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        showTimepicker("start");
                      }}
                      style={styles.datebutton}
                    >
                      <Text style={styles.datetext}>Start Time</Text>
                    </Pressable>
                    {startshow && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={enddate}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </View>
                  <View style={styles.dateview}>
                    <Pressable
                      onPress={() => {
                        showDatepicker("end");
                      }}
                      style={styles.datebutton}
                    >
                      <Text style={styles.datetext}>End Date</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        showTimepicker("end");
                      }}
                      style={styles.datebutton}
                    >
                      <Text style={styles.datetext}>End Time</Text>
                    </Pressable>
                    {endshow && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={enddate}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </View>
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

export default CreateQuiz;

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
