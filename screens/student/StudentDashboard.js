import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const StudentDashboard = ({ navigation }) => {
  return (
    <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text style={styles.heading}>CHOOSE OPTION</Text>
            </View>
            <View style={styles.line} />
            <View>
              <View style={styles.buttons}>
                <LinearGradient
                  start={{ x: 0.0, y: 0.25 }}
                  end={{ x: 0.5, y: 1.0 }}
                  locations={[0, 0.5, 0.6]}
                  colors={["#4c669f", "#3b5998", "#192f6a"]}
                  style={styles.bigButton}
                >
                  <Pressable
                    style={styles.bigButton}
                    onPress={() => {
                      navigation.navigate("StudentSubjects");
                    }}
                    android_ripple={{ color: "grey" }}
                  >
                    <Text style={styles.bigButtonText}>My Courses</Text>
                  </Pressable>
                </LinearGradient>
              </View>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 30,
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
  line: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.6,
    width: "90%",
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 30,
    borderWidth: 2,
  },
  bigButton: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 40,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
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
});
