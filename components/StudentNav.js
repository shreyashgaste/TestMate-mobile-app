import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StudentDashboard from "../screens/student/StudentDashboard";
import StudentSubjects from "../screens/student/StudentSubjects";
import StudentQuestions from "../screens/student/StudentQuestions";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import CustomDrawer from "./CustomDrawer";
import StudentQuiz from "../screens/student/StudentQuiz";
import QuizDetails from "../screens/student/QuizDetails";
import StudentQuizQuestions from "../screens/student/StudentQuizQuestions";
import UpdateYear from "../screens/student/UpdateYear";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DashStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GoDashboard"
        component={StudentDashboard}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="StudentSubjects"
        component={StudentSubjects}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="StudentQuestions"
        component={StudentQuestions}
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
        component={StudentQuiz}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="QuizDetails"
        component={QuizDetails}
        options={{ headerTitle: "", headerShown: "" }}
      />
      <Stack.Screen
        name="StudentQuizQuestions"
        component={StudentQuizQuestions}
        options={{ headerTitle: "", headerShown: "" }}
      />
    </Stack.Navigator>
  );
}
export default function StudentNav() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
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
        name="StudentDashboard"
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
        name="StudentQuiz"
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
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen
        name="UpdateYear"
        component={UpdateYear}
        options={{
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="page-next"
              size={24}
              color={focused ? "white" : "grey"}
            />
          ),
          swipeEnabled: false,
        }}
      />
    </Drawer.Navigator>
  );
}
