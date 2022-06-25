import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
  TextInput,
  Dimensions
} from "react-native";

import { Formik } from "formik";
import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const QuizDetails = ({ route, navigation }) => {
  const { quiz } = route.params;
  const { signOut, showloader, setShowloader } = useContext(AuthContext);

    const loadData = async (values) => {

      setShowloader(true);
      if(!values.passcode.trim())
      {
        setShowloader(false);
            Alert.alert("Please enter the passcode");
          return;
      }
      if(values.passcode.trim() === quiz.passcode)
      {
        const res = await APIurl.post(
            "/getquizquestions",
            { quizId: quiz._id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer " + (await AsyncStorage.getItem("stuToken")),
              },
            }
          )
            .then(async (dataResponse) => {
                setShowloader(false);
              if (dataResponse.data.error === "You must be logged in") {
                Alert.alert("Please log in again");
                signOut();
                return;
              }
              if(dataResponse.data.error)
              {
                  Alert.alert(dataResponse.data.error);
                  return;
              }
              navigation.navigate("StudentQuizQuestions", {quizdata: dataResponse.data, quizId: quiz._id, duration: quiz.duration});
            })
            .catch((error) => {
              console.log(error);
              setShowloader(false);
            });
      }
      else
      {
          Alert.alert("Please enter correct passcode!");
      }
      setShowloader(false);
    };


  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.table}>
              <Text
                style={[
                  styles.heading,
                  { textAlign: "justify", fontWeight: "bold", fontSize: 20},
                ]}
              >
                {quiz.quizName}
              </Text>
              <View>
                <Text style={styles.item}>Course : {quiz.subjectName}</Text>
              </View>
              <View>
                <Text style={[styles.item, {fontWeight: "bold"}]}>
                  Duration : {quiz.duration} minutes
                </Text>
              </View>
              <View>
                <Text style={[styles.item, {fontStyle: "italic"}]}>Start Time</Text>
                <Text style={styles.item}>
                  {new Date(quiz.starttime).toLocaleString()}
                </Text>
              </View>
              <View>
                <Text style={[styles.item, {fontStyle: "italic"}]}>End Time</Text>
                <Text style={styles.item}>
                  {new Date(quiz.endtime).toLocaleString()}
                </Text>
              </View>
              <Formik
                initialValues={{
                  passcode: ""
                }}
                onSubmit={(values) => {
                  loadData(values);
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
                      placeholder="Enter Passcode"
                      value={values.passcode}
                      onChangeText={handleChange("passcode")}
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
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default QuizDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    backgroundColor: "#fcedb7",
    height: Dimensions.get('window').height
  },
  heading: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
  item: {
    alignSelf: "center",
    paddingBottom: 15,
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
  table: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});
