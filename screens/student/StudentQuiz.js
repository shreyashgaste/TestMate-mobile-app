import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";

import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import { LinearGradient } from "expo-linear-gradient";

const StudentQuiz = ({ navigation }) => {
  const { signOut, flag, showloader, setShowloader } = useContext(AuthContext);
  const [currentdate, setCurrentdate] = useState(new Date(Date.now()));
  const [quizes, setQuizes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      console.log(currentdate.toISOString());
      const res = await APIurl.get("/getstudentquizes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("stuToken")),
        },
      }).then(async (dataResponse) => {
          setShowloader(false);
          if (dataResponse.data.error === "You must be logged in") {
            Alert.alert("Please log in again");
            signOut();
            return;
          }
          setQuizes(dataResponse.data);
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server traffic error!");
        });
    };
    loadData();
  }, []);

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            {quizes.error === "No quizes created" ? (
              <View>
                <Text style={styles.heading}>NO QUIZ CREATED</Text>
              </View>
            ) : (
              quizes.map((quiz, idx) => (
                <View key={idx}>
                  <View style={styles.buttons}>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.25 }}
                      end={{ x: 0.5, y: 1.0 }}
                      locations={[0, 0.5, 0.6]}
                      colors={["#4c669f", "#3b5998", "#192f6a"]}
                      style={styles.bigButton}
                    >
                      {new Date(quiz.endtime).getTime() <
                        currentdate.getTime() ||
                      new Date(quiz.starttime).getTime() >
                        currentdate.getTime() ? (
                        <Pressable
                          style={{
                            paddingVertical: 40,
                            paddingHorizontal: 20,
                          }}
                          android_ripple={{ color: "grey" }}
                        >
                          <Text style={styles.bigButtonText}>
                            {quiz.quizName}
                          </Text>
                          {new Date(quiz.starttime).getTime() >
                          currentdate.getTime() ? (
                            <View>
                              <Text style={{ color: "#fff" }}>
                                {new Date(quiz.starttime).toLocaleString()}
                              </Text>
                              <Text style={{ color: "#fff" }}>
                                {new Date(quiz.endtime).toLocaleString()}
                              </Text>
                            </View>
                          ) : (
                            <Text style={{ color: "#fff" }}>Quiz Ended</Text>
                          )}
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{
                            paddingVertical: 40,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            navigation.navigate("QuizDetails", {
                              quiz,
                            });
                          }}
                          android_ripple={{ color: "grey" }}
                        >
                          <Text style={styles.bigButtonText}>
                            {quiz.quizName}
                          </Text>
                          <Text style={{ color: "#fff" }}>
                            {new Date(quiz.starttime).toLocaleString()}
                          </Text>
                          <Text style={{ color: "#fff" }}>
                            {new Date(quiz.endtime).toLocaleString()}
                          </Text>
                        </Pressable>
                      )}
                    </LinearGradient>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default StudentQuiz;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    backgroundColor: "#fcedb7",
  },
  heading: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
  bigButton: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: "70%",
    marginBottom: 15,
  },
  bigButtonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "#fff",
  },
  buttons: {
    justifyContent: "space-between",
  },
});
