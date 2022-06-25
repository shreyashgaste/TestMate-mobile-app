import React, { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootStackScreen from "./components/RootStackScreen";
import StudentNav from "./components/StudentNav";
import TeacherNav from "./components/TeacherNav";
import { AuthContext } from "./components/Context";

export default function Main() {
  const { student, teacher, toggleStudent, toggleTeacher } =
    useContext(AuthContext);
  useEffect(async () => {
    let stuToken;
    let teachToken;
    stuToken = null;
    teachToken = null;
    try {
      stuToken = await AsyncStorage.getItem("stuToken");
      teachToken = await AsyncStorage.getItem("teachToken");
    } catch (e) {
      Alert.alert("An error occured!");
    }
    if (stuToken != null) toggleStudent(true);
    if (teachToken != null) toggleTeacher(true);
  }, [student || teacher]);
  return (
    <NavigationContainer>
      {student != false ? (
        <StudentNav key={student} />
      ) : (
        [
          teacher != false ? (
            <TeacherNav key={teacher} />
          ) : (
            <RootStackScreen key={3} />
          ),
        ]
      )}
    </NavigationContainer>
  );
}
