import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import Checkbox from "expo-checkbox";

const QuizDashboard = ({ route, navigation }) => {
  const { quizId } = route.params;
  const { signOut, showloader, setShowloader } =
    useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [idstoshow, setIdstoshow] = useState([""]);
  const [idstoadd, setIdstoadd] = useState([]);
  const [showform, setShowform] = useState(true);
  const loadData = async (values) => {
    setShowloader(true);
    setShowform(false);
    const res = await APIurl.post(
      "/gettopicquestions",
      { subjectName: values.subjectName, topic: values.topic },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("teachToken")),
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
        if (dataResponse.data.error) setShowform(true);
        setShowloader(false);
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
    });
  };

  const submitQuestions = async () => {
      const email = await AsyncStorage.getItem("user_email");
      setShowloader(true);
    const res = await APIurl.post(
      "/storequestions",
      { email, quizId, idstoadd},
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
        if (dataResponse.data.error)
        {
            Alert.alert(dataResponse.data.error);
            return;
        }
        Alert.alert(dataResponse.data.message);
        navigation.pop();
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          {showform ? (
            <View style={styles.container}>
              <Formik
                initialValues={{
                  subjectName: "",
                  topic: "",
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
                      placeholder="Subject"
                      value={values.subjectName}
                      onChangeText={handleChange("subjectName")}
                    />
                    <TextInput
                      style={[{ height: 40 }, styles.input]}
                      placeholder="Topic"
                      value={values.topic}
                      onChangeText={handleChange("topic")}
                    />
                    <Pressable
                      style={[{ backgroundColor: "#007bff" }, styles.button]}
                      onPress={handleSubmit}
                      android_ripple={{ color: "black" }}
                    >
                      <Text style={[{ color: "white" }, styles.buttonText]}>
                        SEARCH
                      </Text>
                    </Pressable>
                  </View>
                )}
              </Formik>
            </View>
          ) : (
            <View style={styles.container}>
              {questions.error === "No questions added" ? (
                <View>
                  <Text style={styles.heading}>NO QUESTIONS ADDED</Text>
                </View>
              ) : (
                <View>
                  {questions.map((quest, idx) => (
                    <View key={idx}>
                      <View style={styles.table}>
                        <Checkbox
                          style={styles.checkbox}
                          value={idstoadd.includes(quest._id)}
                          onValueChange={() => {
                            if (!idstoadd.includes(quest._id))
                              setIdstoadd([...idstoadd, quest._id]);
                            else
                              setIdstoadd(
                                idstoadd.filter((id) => {
                                  return id !== quest._id;
                                })
                              );
                          }}
                          color={
                            idstoadd.includes(quest._id) ? "#4630EB" : undefined
                          }
                        />

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
                      </View>
                    </View>
                  ))}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={submitQuestions}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      ADD
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default QuizDashboard;

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
  checkbox: {
    margin: 8,
  },
  item: {
    paddingBottom: 10,
  },
  deleteButton: {
    alignSelf: "flex-end",
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
