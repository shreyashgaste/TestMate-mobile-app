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

const MySubjects = ({ navigation }) => {
  const { signOut, flag, showloader, setShowloader } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      const email = await AsyncStorage.getItem("user_email");
      const res = await APIurl.post(
        "/getsubjects",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (await AsyncStorage.getItem("teachToken")),
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
          setCourses(dataResponse.data);
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
    };
    loadData();
  }, [flag]);

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
                  navigation.navigate("AddSubject");
                }}
                android_ripple={{ color: "grey" }}
              >
                <Text style={styles.bigButtonText}>+ ADD NEW SUBJECT</Text>
              </Pressable>
            </LinearGradient>
            {courses.error === "No subjects registered" ? (
              <View>
                <Text style={styles.heading}>NO SUBJECTS REGISTERED</Text>
              </View>
            ) : (
              courses.map((subject, idx) => (
                <View key={idx}>
                  <View style={styles.buttons}>
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
                          navigation.navigate("MyQuestions", {
                            subjectName: subject.name,
                          });
                        }}
                        android_ripple={{ color: "grey" }}
                      >
                        <Text style={styles.bigButtonText}>{subject.name}</Text>
                      </Pressable>
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

export default MySubjects;

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
