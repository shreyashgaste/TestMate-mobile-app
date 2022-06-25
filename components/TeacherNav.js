import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TeacherDashboard from "../screens/teacher/TeacherDashboard";
import TeacherSignup from "../screens/teacher/TeacherSignup";
import AddSubject from "../screens/teacher/AddSubject";
import MySubjects from "../screens/teacher/MySubjects";
import AddQuestion from "../screens/teacher/AddQuestion";
import MyQuestions from "../screens/teacher/MyQuestions";
import AddQuestionImage from "../screens/teacher/AddQuestionImage";
import IsImageIncluded from "../screens/teacher/IsImageIncluded";
import CreateQuiz from "../screens/teacher/CreateQuiz";
import TeacherQuiz from "../screens/teacher/TeacherQuiz";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import CustomDrawer from "./CustomDrawer";
import QuizDashboard from "../screens/teacher/QuizDashboard";
import QuizQuestions from "../screens/teacher/QuizQuestions";
import GetResults from "../screens/teacher/GetResults";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DashStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GoDashboard"
        component={TeacherDashboard}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="TeacherSignup"
        component={TeacherSignup}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="AddSubject"
        component={AddSubject}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="MySubjects"
        component={MySubjects}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="AddQuestion"
        component={AddQuestion}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="MyQuestions"
        component={MyQuestions}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="IsImageIncluded"
        component={IsImageIncluded}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="AddQuestionImage"
        component={AddQuestionImage}
        options={{ headerTitle: "", headerShown: "" }}
      />
    </Stack.Navigator>
  );
}
function QuizStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GoQuiz"
        component={TeacherQuiz}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuiz}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="QuizQuestions"
        component={QuizQuestions}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="QuizDashboard"
        component={QuizDashboard}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="GetResults"
        component={GetResults}
        options={{ headerTitle: "", headerShown: "" }}
      />
    </Stack.Navigator>
  );
}
export default function TeacherNav() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        // headerShown: false,
        drawerActiveBackgroundColor: "#192f6a",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="TeacherDashboard"
        children={DashStack}
        options={{
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={24}
              color={focused ? "white" : "grey"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="TeacherQuiz"
        children={QuizStack}
        options={{
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <AntDesign
              name="book"
              size={24}
              color={focused ? "white" : "grey"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
