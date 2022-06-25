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

import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import CountDown from "react-native-countdown-component";
import { CommonActions, StackActions } from "@react-navigation/native";

let submitted = false;
let autosubmit = false;
const StudentQuizQuestions = ({ route, navigation }) => {
  const { quizdata, quizId, duration } = route.params;
  const { signOut, showloader, setShowloader } = useContext(AuthContext);

  const [stuAns, setStuAns] = useState([]);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        if (autosubmit === true) {
          Alert.alert("Time up!", "Your test automatically submitted.", [
            {
              text: "Ok",
              style: "destructive",
              onPress: () => {
                autosubmit = false;
                navigation.dispatch(e.data.action);
              },
            },
          ]);
        } else if (submitted === true) {
          Alert.alert("Thank You!", "Your test is submitted.", [
            {
              text: "Ok",
              style: "destructive",
              onPress: () => {
                submitted = false;
                navigation.dispatch(e.data.action);
              },
            },
          ]);
        } else if (autosubmit === false && submitted === false) {
          e.preventDefault();
          Alert.alert("Warning!", "Please submit the test first.", [
            {
              text: "Ok",
              style: "destructive",
              onPress: () => {},
            },
          ]);
        }
      }),
    [navigation]
  );

  const submitQuiz = async () => {
    setShowloader(true);
    const res = await APIurl.post(
      "/storeresult",
      { stuAns, quizId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("stuToken")),
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
        navigation.goBack();
      })
      .catch((error) => {
        setShowloader(false);
        Alert.alert("Server error!");
      });
  };

  function calltoAutosubmit() {
    submitQuiz();
  }
  function getAnswer(quest) {
    let a;
    for (let j = 0; j < stuAns.length; j++) {
      if (quest._id === stuAns[j].id) a = stuAns[j];
    }
    if (!a) return null;
    let i = 0;
    for (i = 0; i < quest.choices.length; i++) {
      if (quest.choices[i].choice === a.choosen) return i;
      if (quest.choices[i].optionImage === a.choosen) return i;
    }

    return 0;
  }

  return (
    <>
      <SafeAreaView>
        <View style={styles.containercountdown}>
          <CountDown
            size={28}
            until={Number(duration) * 60}
            onFinish={() => {
              autosubmit = true;
              calltoAutosubmit();
            }}
            digitStyle={{
              backgroundColor: "#FFF",
              borderWidth: 2,
              borderColor: "#1CC625",
            }}
            digitTxtStyle={{ color: "#1CC625" }}
            timeLabelStyle={{ color: "red", fontWeight: "bold" }}
            separatorStyle={{ color: "#1CC625" }}
            timeToShow={["M", "S"]}
            timeLabels={{ m: null, s: null }}
            showSeparator
          />
        </View>
        <ScrollView style={{ marginTop: 80 }}>
          <View style={styles.container}>
            {quizdata.error === "No questions added" ? (
              <View>
                <Text style={styles.heading}>NO QUESTIONS ADDED</Text>
              </View>
            ) : (
              quizdata.map((quest, idx) => (
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
                    <RadioButtonGroup
                      containerStyle={{ marginBottom: 10 }}
                      selected={
                        getAnswer(quest) != null ? (
                          quest.choices[getAnswer(quest)].optionImage ? (
                            quest.choices[getAnswer(quest)].optionImage
                          ) : (
                            quest.choices[getAnswer(quest)].choice
                          )
                        ) : (
                          <></>
                        )
                      }
                      onSelected={(value) => {
                        setStuAns([
                          ...stuAns,
                          { id: quest._id, choosen: value },
                        ]);
                      }}
                      radioBackground="green"
                    >
                      <RadioButtonItem
                        value={
                          quest.choices[0].optionImage
                            ? quest.choices[0].optionImage
                            : quest.choices[0].choice
                        }
                        label={
                          <View>
                            <Text style={styles.item}>
                              Option 1 : {quest.choices[0].choice}
                            </Text>
                            {quest.choices[0].optionImage ? (
                              <Image
                                source={{ uri: quest.choices[0].optionImage }}
                                style={styles.img}
                              />
                            ) : null}
                          </View>
                        }
                      />
                      <RadioButtonItem
                        value={
                          quest.choices[1].optionImage
                            ? quest.choices[1].optionImage
                            : quest.choices[1].choice
                        }
                        label={
                          <View>
                            <Text style={styles.item}>
                              Option 2 : {quest.choices[1].choice}
                            </Text>
                            {quest.choices[1].optionImage ? (
                              <Image
                                source={{ uri: quest.choices[1].optionImage }}
                                style={styles.img}
                              />
                            ) : null}
                          </View>
                        }
                      />
                      {!quest.choices[2] ? (
                        <></>
                      ) : (
                        <RadioButtonItem
                          value={
                            quest.choices[2].optionImage
                              ? quest.choices[2].optionImage
                              : quest.choices[2].choice
                          }
                          label={
                            <View>
                              <Text style={styles.item}>
                                Option 3 : {quest.choices[2].choice}
                              </Text>
                              {quest.choices[2].optionImage ? (
                                <Image
                                  source={{ uri: quest.choices[2].optionImage }}
                                  style={styles.img}
                                />
                              ) : null}
                            </View>
                          }
                        />
                      )}
                      {!quest.choices[3] ? (
                        <></>
                      ) : (
                        <RadioButtonItem
                          value={
                            quest.choices[3].optionImage
                              ? quest.choices[3].optionImage
                              : quest.choices[3].choice
                          }
                          label={
                            <View>
                              <Text style={styles.item}>
                                Option 4 : {quest.choices[3].choice}
                              </Text>
                              {quest.choices[3].optionImage ? (
                                <Image
                                  source={{ uri: quest.choices[3].optionImage }}
                                  style={styles.img}
                                />
                              ) : null}
                            </View>
                          }
                        />
                      )}
                      {!quest.choices[4] ? (
                        <></>
                      ) : (
                        <RadioButtonItem
                          value={
                            quest.choices[4].optionImage
                              ? quest.choices[4].optionImage
                              : quest.choices[4].choice
                          }
                          label={
                            <View>
                              <Text style={styles.item}>
                                Option 5 : {quest.choices[4].choice}
                              </Text>
                              {quest.choices[4].optionImage ? (
                                <Image
                                  source={{ uri: quest.choices[4].optionImage }}
                                  style={styles.img}
                                />
                              ) : null}
                            </View>
                          }
                        />
                      )}
                    </RadioButtonGroup>
                  </View>
                </View>
              ))
            )}
            <Pressable
              style={[{ backgroundColor: "#007bff" }, styles.button]}
              onPress={() => {
                submitted = true;
                calltoAutosubmit();
              }}
              android_ripple={{ color: "black" }}
            >
              <Text style={[{ color: "white" }, styles.buttonText]}>
                SUBMIT
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default StudentQuizQuestions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    backgroundColor: "#fcedb7",
  },
  containercountdown: {
    zIndex: 1,
    position: "absolute",
    alignSelf: "center",
    marginTop: 40,
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
