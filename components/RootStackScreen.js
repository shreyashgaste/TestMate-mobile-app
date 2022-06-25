import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StudentSignIn from "../screens/student/StudentSignIn";
import StudentSignup from "../screens/student/StudentSignup";
import TeacherSignIn from "../screens/teacher/TeacherSignIn";
import ForgotPassword from "../screens/common/ForgotPassword";

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
  return (
    <RootStack.Navigator headerShown={false}>
      <RootStack.Screen
        name="StudentSignIn"
        component={StudentSignIn}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <RootStack.Screen
        name="StudentSignup"
        component={StudentSignup}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <RootStack.Screen
        name="TeacherSignIn"
        component={TeacherSignIn}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerTitle: "", headerShown: "" }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackScreen;
