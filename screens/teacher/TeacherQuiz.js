import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import { LinearGradient } from "expo-linear-gradient";

const TeacherQuiz = ({ navigation }) => {
  const { signOut, flag, toggleFlag, showloader, setShowloader } =
    useContext(AuthContext);
  const [currentdate, setCurrentdate] = useState(new Date(Date.now()));
  const [quizes, setQuizes] = useState([]);
  const createTwoButtonAlert = (id) => {
    Alert.alert(
      "Warning",
      "Once you pressed ok, the quiz and corresponding results will be permanently deleted.",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            removeQuiz(id);
          },
        },
      ]
    );
  };
  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      const email = await AsyncStorage.getItem("user_email");
      const res = await APIurl.get("/getquizes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("teachToken")),
        },
      })

        .then(async (dataResponse) => {
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
          Alert.alert("Server error!");
        });
    };
    loadData();
  }, [flag]);

  const removeQuiz = async (_id) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/removequiz",
      { _id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("teachToken")),
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
        if (dataResponse.data.error) {
          Alert.alert(dataResponse.data.error);
          return;
        }
        Alert.alert(dataResponse.data.message);
        toggleFlag();
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
          <View style={styles.container}>
            <LinearGradient
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.5, y: 1.0 }}
              locations={[0, 0.5, 0.6]}
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.bigButton}
            >
              <Pressable
                style={{ paddingVertical: 40, paddingHorizontal: 20 }}
                onPress={() => {
                  navigation.navigate("CreateQuiz");
                }}
                android_ripple={{ color: "grey" }}
              >
                <Text style={styles.bigButtonText}>+ CREATE A QUIZ</Text>
              </Pressable>
            </LinearGradient>
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
                      {new Date(quiz.starttime).getTime() <
                      currentdate.getTime() ? (
                        <Pressable
                          style={{
                            paddingVertical: 40,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            navigation.navigate("GetResults", {
                              quiz,
                            });
                          }}
                          android_ripple={{ color: "grey" }}
                        >
                          <Text style={styles.bigButtonText}>
                            {quiz.quizName}
                          </Text>
                          <Text style={{ color: "#fff" }}>{quiz.year}</Text>
                          {new Date(quiz.endtime).getTime() <
                          currentdate.getTime() ? (
                            <Text style={{ color: "#fff" }}>Quiz Ended</Text>
                          ) : (
                            <Text style={{ color: "#fff" }}>
                              Quiz In Progress
                            </Text>
                          )}
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{
                            paddingVertical: 40,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            navigation.navigate("QuizQuestions", {
                              quizId: quiz._id,
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
                          <Text style={{ color: "#fff" }}>{quiz.year}</Text>
                        </Pressable>
                      )}
                      <View style={styles.buttons}>
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => {
                            createTwoButtonAlert(quiz._id);
                          }}
                          android_ripple={{ color: "grey" }}
                        >
                          <AntDesign name="delete" size={24} color="red" />
                        </Pressable>
                      </View>
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

export default TeacherQuiz;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    backgroundColor: "#fcedb7",
  },
  deleteButton: {
    alignSelf: "flex-end",
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
