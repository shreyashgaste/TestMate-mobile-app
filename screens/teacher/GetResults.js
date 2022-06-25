import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable
} from "react-native";

import { AuthContext } from "../../components/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import APIurl from "../common/api/APIurl";
import Apploader from "../common/Apploader";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const GetResults = ({ route, navigation }) => {
  const { quiz } = route.params;
  const { signOut, showloader, setShowloader } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      setShowloader(true);
      const res = await APIurl.post(
        "/getresult",
        { quizId: quiz._id },
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
          if (dataResponse.data.error) {
            Alert.alert(dataResponse.data.error);
            return;
          }
          setResults(dataResponse.data.scores);
          setShowloader(false);
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
    };
    loadData();
  }, []);

  const downloadResult = async () => {
    var ws = XLSX.utils.json_to_sheet(results);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scores");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri =
      FileSystem.cacheDirectory + `${quiz.quizName}-${quiz.year}-scores.xlsx`;
    // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
  };
  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.table}>
              <Text
                style={[
                  styles.item,
                  { textAlign: "justify", fontWeight: "bold", fontSize: 20 },
                ]}
              >
                {quiz.quizName}
              </Text>
              <View>
                <Text style={styles.item}>Course : {quiz.subjectName}</Text>
              </View>
              <View>
                <Text style={[styles.item, { fontWeight: "bold" }]}>
                  Duration : {quiz.duration} minutes
                </Text>
              </View>
              <View>
                <Text style={[styles.item, { fontStyle: "italic" }]}>
                  Start Time
                </Text>
                <Text style={styles.item}>
                  {new Date(quiz.starttime).toLocaleString()}
                </Text>
              </View>
              <View>
                <Text style={[styles.item, { fontStyle: "italic" }]}>
                  End Time
                </Text>
                <Text style={styles.item}>
                  {new Date(quiz.endtime).toLocaleString()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.item}>Passcode : </Text>
                <Text style={styles.item}>{quiz.passcode}</Text>
              </View>
              <Pressable
                style={[{ backgroundColor: "#007bff" }, styles.button]}
                onPress={downloadResult}
                android_ripple={{ color: "black" }}
              >
                <Text style={[{ color: "white" }, styles.buttonText]}>
                  DOWNLOAD RESULT
                </Text>
              </Pressable>
              <View
                style={[styles.resulttable, { justifyContent: "space-evenly" }]}
              >
                <Text>PRN No </Text>
                <Text>Score</Text>
              </View>
              {results.length !== 0 ? (
                results.map((res, id) => (
                  <View key={id} style={styles.resulttable}>
                    <Text>{res.prn} : </Text>
                    <Text>{res.score}</Text>
                  </View>
                ))
              ) : (
                <></>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default GetResults;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    backgroundColor: "#fcedb7",
  },
  resulttable: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "grey",
    padding: 8,
  },
  item: {
    alignSelf: "center",
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
  button: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    marginTop: 15,
    marginBottom: 15
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
