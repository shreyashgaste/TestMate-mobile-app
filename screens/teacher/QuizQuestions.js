import {
  StyleSheet,
  Text,
  View,
  Image,
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

const QuizQuestions = ({ route, navigation }) => {
  const { quizId } = route.params;
  const { signOut, showloader, setShowloader } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [idstoshow, setIdstoshow] = useState([""]);
  const [sflg, setSflg] = useState(false);
  const createTwoButtonAlert = (id) => {
    Alert.alert(
      "Warning",
      "Once you pressed ok, the question will be permanently deleted from the quiz.",
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
            removefromquiz(id);
          },
        },
      ]
    );
  };
  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      const res = await APIurl.post(
        "/getquizquestions",
        { quizId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (await AsyncStorage.getItem("teachToken")),
          },
        }
      )
        .then(async (dataResponse) => {
          if (dataResponse.data.error === "You must be logged in") {
            setShowloader(false);
            Alert.alert("Please log in again");
            signOut();
            return;
          }
          setQuestions(dataResponse.data);
          setShowloader(false);
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
    };
    loadData();
  }, [sflg]);

  const removefromquiz = async (questId) => {
    setShowloader(true);
    const res = await APIurl.post(
      "/removequizquestion",
      { quizId, questId },
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
        setSflg(!sflg);
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
            <Pressable
              style={styles.bigButton}
              onPress={() => {
                navigation.navigate("QuizDashboard", {
                  quizId,
                });
              }}
              android_ripple={{ color: "grey" }}
            >
              <Text style={styles.bigButtonText}>+ ADD QUESTION TO QUIZ</Text>
            </Pressable>
            {questions.error === "No questions added" ? (
              <View>
                <Text style={styles.heading}>NO QUESTIONS ADDED</Text>
              </View>
            ) : (
              questions.map((quest, idx) => (
                <View key={idx}>
                  <View style={styles.table}>
                    <Text
                      style={[
                        styles.item,
                        { textAlign: "justify", fontWeight: "bold" },
                      ]}
                    >
                      {quest.questionName.question}
                    </Text>
                    {quest.questionName.questionImage ? (
                      <Image
                        source={{ uri: quest.questionName.questionImage }}
                        style={styles.img}
                      />
                    ) : (
                      <></>
                    )}
                    {quest.choices.map((c, id) => (
                      <View key={id} style={styles.options}>
                        <Text style={styles.item}>
                          Option {id + 1} : {c.choice}
                        </Text>
                        {c.optionImage ? (
                          <Image
                            source={{ uri: c.optionImage }}
                            style={styles.img}
                          />
                        ) : null}
                      </View>
                    ))}
                    <View>
                      <Pressable
                        style={{
                          marginTop: 10,
                          alignSelf: "flex-start",
                        }}
                        onPress={() => {
                          if (!idstoshow.includes(quest._id))
                            setIdstoshow([...idstoshow, quest._id]);
                          else
                            setIdstoshow(
                              idstoshow.filter((id) => {
                                return id !== quest._id;
                              })
                            );
                        }}
                        android_ripple={{ color: "grey" }}
                      >
                        {idstoshow.includes(quest._id) ? (
                          <Text style={{ color: "black", fontSize: 14 }}>
                            Hide Answer
                          </Text>
                        ) : (
                          <Text style={{ color: "black", fontSize: 14 }}>
                            View Answer
                          </Text>
                        )}
                      </Pressable>
                    </View>
                    {idstoshow.includes(quest._id) ? (
                      <View>
                        <Text style={[styles.item, { fontWeight: "bold" }]}>
                          Answer : {quest.answerName.answer}
                        </Text>
                        {quest.answerName.answerImage ? (
                          <Image
                            source={{ uri: quest.answerName.answerImage }}
                            style={styles.img}
                          />
                        ) : null}
                      </View>
                    ) : null}
                    <View style={styles.buttons}>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => {
                          createTwoButtonAlert(quest._id);
                        }}
                        android_ripple={{ color: "grey" }}
                      >
                        <AntDesign name="delete" size={24} color="red" />
                      </Pressable>
                    </View>
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

export default QuizQuestions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  item: {
    paddingBottom: 10,
  },
  bigButton: {
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 20,
    width: "70%",
    marginBottom: 15,
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
  bigButtonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "blue",
  },
  buttons: {
    justifyContent: "space-between",
  },
  table: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  options: {
    alignContent: "flex-start",
  },
  img: {
    resizeMode: "contain",
    width: 250,
    height: undefined,
    aspectRatio: 1,
    alignSelf: "center",
    borderColor: "grey",
    padding: 10,
  },
});
