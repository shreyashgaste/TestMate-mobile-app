import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from "react-native";

import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";

const StudentQuestions = ({ route, navigation }) => {
  const { subjectName } = route.params;
  const { signOut, flag, showloader, setShowloader } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [idstoshow, setIdstoshow] = useState([""]);

  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      const res = await APIurl.post(
        "/getquestions",
        { subjectName },
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
          setQuestions(dataResponse.data);
        })
        .catch((error) => {
          console.log(error);
          setShowloader(false);
        });
    };
    loadData();
  }, [flag]);

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
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
                          if (!(idstoshow.includes(quest._id)))
                            setIdstoshow([...idstoshow, quest._id]);
                          else
                            setIdstoshow(idstoshow.filter((id) => {
                              return id !== quest._id;
                            }))
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
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default StudentQuestions;

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
    alignSelf: "flex-start",
    paddingBottom: 15,
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
