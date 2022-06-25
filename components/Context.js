import React, { useState } from "react";
import { Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import APIurl from "../screens/common/api/APIurl";
export const AuthContext = React.createContext();

const AuthcontextProvider = (props) => {
  const [student, setStudent] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [flag, setFlag] = useState(false);
  const [showloader, setShowloader] = useState(false);
  const [autosubmit, setAutosubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toload, setToload] = useState(false);

  const toggleStudent = (st) => {
    setStudent(st);
  };
  const toggleTeacher = (st) => {
    setTeacher(st);
  };
  const toggleFlag = () => {
    setFlag(!flag);
  };
  const signOut = async () => {
    setShowloader(true);
    let token;
    const email = await AsyncStorage.getItem("user_email");
    console.log(await AsyncStorage.getItem("user_email"));
    if (await AsyncStorage.getItem("stuToken"))
      token = await AsyncStorage.getItem("stuToken");
    if (await AsyncStorage.getItem("teachToken"))
      token = await AsyncStorage.getItem("teachToken");
    if (token !== null) {
      const res = await APIurl.post(
        "/logout",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
        .then(async (dataResponse) => {
          setShowloader(false);
          if (dataResponse.data.message) {
            if (await AsyncStorage.getItem("stuToken"))
              await AsyncStorage.removeItem("stuToken");
            if (await AsyncStorage.getItem("teachToken"))
              await AsyncStorage.removeItem("teachToken");
            await AsyncStorage.clear();
            setStudent(false);
            setTeacher(false);
            Alert.alert(dataResponse.data.message);
          }
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        teacher,
        flag,
        toggleStudent,
        toggleTeacher,
        toggleFlag,
        showloader,
        setShowloader,
        signOut,
        autosubmit,
        setAutosubmit,
        submitted,
        setSubmitted,
        toload,
        setToload,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthcontextProvider;
