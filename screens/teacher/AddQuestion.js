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

const AddQuestion = ({ route, navigation }) => {
  const { subjectName } = route.params;
  const { signOut, toggleFlag, showloader, setShowloader } =
    useContext(AuthContext);
  const [text, setText] = useState("");
  const handleQuestion = async (values) => {
    setShowloader(true);
    if(!values.topic.trim())
    {
      Alert.alert("Please enter the topic of question...");
      setShowloader(false);
      return;
    }
    if(!values.questionName.trim())
    {
      Alert.alert("Please enter the question...");
      setShowloader(false);
      return;
    }
    if(!values.answer.trim())
    {
      Alert.alert("Please enter the answer...");
      setShowloader(false);
      return;
    }
    if(!values.choice1.trim())
    {
      Alert.alert("Please enter the choice properly...");
      setShowloader(false);
      return;
    }
    if(!values.choice2.trim())
    {
      Alert.alert("Please enter the choice properly...");
      setShowloader(false);
      return;
    }
    const choices = [];
    var obj1 = {};
    obj1["choice"] = values.choice1;
    choices.push(obj1);
    var obj2 = {};
    obj2["choice"] = values.choice2;
    choices.push(obj2);
    var obj3 = {};
    if (values.choice3) {
      obj3["choice"] = values.choice3;
      choices.push(obj3);
    }
    var obj4 = {};
    if (values.choice4) {
      obj4["choice"] = values.choice4;
      choices.push(obj4);
    }
    var obj5 = {};
    if (values.choice5) {
      obj5["choice"] = values.choice5;
      choices.push(obj5);
    }
    var found = false;
    for (var i = 0; i < choices.length; i++) {
      console.log("loop");
      if (choices[i].choice.trim() === values.answer.trim()) {
        found = true;
        break;
      }
    }
    if(choices.length < 2)
    {
      Alert.alert("Please enter at least two options...");
      return;
    }
    if (!found) {
      setShowloader(false);
      Alert.alert("Please provide the correct answer from the options.");
      return;
    }
    const res = await APIurl.post(
      "/addquestion",
      {
        topic: values.topic,
        questionName: values.questionName,
        subjectName,
        choices,
        answer: values.answer,
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
          Alert.alert("Process unsuccessful");
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
              <Text style={styles.heading}>ADD NEW QUESTION</Text>
            </View>
            <Formik
              initialValues={{
                topic: "",
                questionName: "",
                choice1: "",
                choice2: "",
                choice3: "",
                choice4: "",
                choice5: "",
                answer: "",
              }}
              onSubmit={(values) => {
                handleQuestion(values);
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
                    placeholder="Topic"
                    value={values.topic}
                    onChangeText={handleChange("topic")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Question"
                    value={values.questionName}
                    onChangeText={handleChange("questionName")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Option 1"
                    value={values.choice1}
                    onChangeText={handleChange("choice1")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Option 2"
                    value={values.choice2}
                    onChangeText={handleChange("choice2")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Option 3"
                    value={values.choice3}
                    onChangeText={handleChange("choice3")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Option 4"
                    value={values.choice4}
                    onChangeText={handleChange("choice4")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Option 5"
                    value={values.choice5}
                    onChangeText={handleChange("choice5")}
                    defaultValue={text}
                  />
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Answer"
                    value={values.answer}
                    onChangeText={handleChange("answer")}
                    defaultValue={text}
                    // multiline={true}
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

export default AddQuestion;

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
