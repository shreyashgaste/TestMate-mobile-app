import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../components/Context";
import APIurl from "../common/api/APIurl";

import mime from "mime";
import Apploader from "../common/Apploader";
import UploadProgress from "../common/UploadProgress";

const AddQuestionImage = ({ route, navigation }) => {
  const { questionId } = route.params;
  const { signOut, showloader, setShowloader } = useContext(AuthContext);
  const [isQuestionImage, setIsQuestionImage] = useState(true);
  const [isChoice1Image, setIsChoice1Image] = useState(false);
  const [isChoice2Image, setIsChoice2Image] = useState(false);
  const [isChoice3Image, setIsChoice3Image] = useState(false);
  const [isChoice4Image, setIsChoice4Image] = useState(false);
  const [isChoice5Image, setIsChoice5Image] = useState(false);
  const [isAnswerImage, setIsAnswerImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [img, setImg] = useState("");
  const [text, setText] = useState("");
  const openImageLibrary = async () => {
    const getFileInfo = async (fileURI) => {
      const fileInfo = await FileSystem.getInfoAsync(fileURI);
      return fileInfo;
    };

    const isLessThanFourMB = (fileSize, smallerThanSizeMB) => {
      const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB;
      return isOk;
    };
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need permissions to access you storage. Go to settings & update the permissions for this app."
      );
      return;
    }
    try {
      if (status === "granted") {
        const response = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
        if (!response.cancelled) {
          setImg(response.uri);
          const { uri, type } = response;
          const fileInfo = await getFileInfo(uri);
          if (!fileInfo?.size) {
            Alert.alert("Can't select this file as the size is unknown.");
            return;
          }
          if (type === "image") {
            const isLt4MB = isLessThanFourMB(fileInfo.size, 4);
            if (!isLt4MB) {
              Alert.alert("Image size must be smaller than 4MB!");
              return;
            }
          }
        }
      }
    } catch (error) {
      Alert.alert("An error occured!");
    }
  };

  const uploadImageToServer = async (values) => {
    setShowloader(true);
    let backenddata = "";
    if (values.title === "question") {
      if (!values.questionName) {
        setShowloader(false);
        Alert.alert("Please provide the question");
        return;
      }
      values.choiceNumber = "0";
      backenddata = values.questionName;
    }
    if (values.title === "answer") {
      if (!values.answer) {
        setShowloader(false);
        Alert.alert("Please provide the answer");
        return;
      }
      values.choiceNumber = "0";
      backenddata = values.answer;
    }
    if (values.title === "choice1") {
      if (values.choiceNumber === "1") {
        backenddata = values.choice1;
      }
    }
    if (values.title === "choice2") {
      if (values.choiceNumber === "2") {
        backenddata = values.choice2;
      }
    }
    if (values.title === "choice3") {
      if (values.choiceNumber === "3") {
        backenddata = values.choice3;
      }
    }
    if (values.title === "choice4") {
      if (values.choiceNumber === "4") {
        backenddata = values.choice4;
      }
    }
    if (values.title === "choice5") {
      if (values.choiceNumber === "5") {
        backenddata = values.choice5;
      }
    }
    if (!img) {
      let topic = "";
      if(values.title === "question")
        topic = values.topic;
      const res = await APIurl.post(
        "/customquestion",
        { title: values.title, topic, questionId, backenddata },
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
          if (dataResponse.data.error) {
            if (dataResponse.data.error === "You must be logged in") {
              Alert.alert("Please log in again");
              signOut();
              return;
            }
            Alert.alert(dataResponse.data.error);
            Alert.alert("Process unsuccessful");
            return;
          } else {
            Alert.alert("Successfully added!");
            setImg("");
            setText("");
          }
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
      setImg(null);
    }
    if (img) {
      const formData = new FormData();
      formData.append("image", {
        name: img.split("/") + "_image",
        uri: img,
        type: mime.getType(img),
      });
      formData.append("title", values.title);
      if(values.title === "question")
        formData.append("topic", values.topic);
      formData.append("choiceNumber", values.choiceNumber);
      formData.append("questionId", questionId);
      formData.append("backenddata", backenddata);
      const res = await APIurl.post("/uploadimage", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data, application/json",
          Authorization: "Bearer " + (await AsyncStorage.getItem("teachToken")),
        },
        onUploadProgress: ({ loaded, total }) => setProgress(loaded / total),
      })
        .then(async (dataResponse) => {
          setProgress(0);
          setShowloader(false);
          if (dataResponse.data.error) {
            if (dataResponse.data.error === "You must be logged in") {
              Alert.alert("Please log in again");
              signOut();
              return;
            }
            Alert.alert(dataResponse.data.error);
            Alert.alert("Process unsuccessful");
            return;
          } else {
            Alert.alert("Successfully added!");
            setImg(null);
            setText("");
          }
        })
        .catch((error) => {
          setShowloader(false);
          Alert.alert("Server error!");
        });
      setImg("");
    }
    if (values.title === "question") {
      setIsQuestionImage(false);
      setIsChoice1Image(true);
    }
    if (values.title === "choice1") {
      setIsChoice1Image(false);
      setIsChoice2Image(true);
    }
    if (values.title === "choice2") {
      setIsChoice2Image(false);
      setIsChoice3Image(true);
    }
    if (values.title === "choice3") {
      setIsChoice3Image(false);
      setIsChoice4Image(true);
    }
    if (values.title === "choice4") {
      setIsChoice4Image(false);
      setIsChoice5Image(true);
    }
    if (values.title === "choice5") {
      setIsChoice5Image(false);
      setIsAnswerImage(true);
    }
    if (values.title === "answer") {
      setShowloader(false);
      navigation.navigate("MySubjects");
      return;
    }
  };

  return (
    <>
      <View style={styles.container}>
        {isQuestionImage ? (
          <View>
            <Formik
              initialValues={{
                topic: "",
                questionName: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "question";
                uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Topic</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Topic"
                    value={values.topic}
                    onChangeText={handleChange("topic")}
                    defaultValue={text}
                    required
                  />
                  <Text style={styles.head}>Question</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Question"
                    value={values.questionName}
                    onChangeText={handleChange("questionName")}
                    defaultValue={text}
                    required
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isChoice1Image ? (
          <View>
            <Formik
              initialValues={{
                choice1: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "choice1";
                (values.choiceNumber = "1"), uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Choice 1</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Choice1"
                    value={values.choice1}
                    onChangeText={handleChange("choice1")}
                    defaultValue={text}
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isChoice2Image ? (
          <View>
            <Formik
              initialValues={{
                choice2: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "choice2";
                (values.choiceNumber = "2"), uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Choice 2</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Choice2"
                    value={values.choice2}
                    onChangeText={handleChange("choice2")}
                    defaultValue={text}
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isChoice3Image ? (
          <View>
            <Formik
              initialValues={{
                choice3: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "choice3";
                (values.choiceNumber = "3"), uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Choice 3</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Choice3"
                    value={values.choice3}
                    onChangeText={handleChange("choice3")}
                    defaultValue={text}
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[{ backgroundColor: "white" }, styles.skipbutton]}
                    onPress={() => {
                      setIsChoice3Image(false);
                      setIsChoice4Image(true);
                    }}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "grey" }, styles.buttonText]}>
                      SKIP
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isChoice4Image ? (
          <View>
            <Formik
              initialValues={{
                choice4: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "choice4";
                (values.choiceNumber = "4"), uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Choice 4</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Choice4"
                    value={values.choice4}
                    onChangeText={handleChange("choice4")}
                    defaultValue={text}
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[{ backgroundColor: "white" }, styles.skipbutton]}
                    onPress={() => {
                      setIsChoice4Image(false);
                      setIsChoice5Image(true);
                    }}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "grey" }, styles.buttonText]}>
                      SKIP
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isChoice5Image ? (
          <View>
            <Formik
              initialValues={{
                choice5: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "choice5";
                (values.choiceNumber = "5"), uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Choice 5</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Choice5"
                    value={values.choice5}
                    onChangeText={handleChange("choice5")}
                    defaultValue={text}
                  />
                  {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[{ backgroundColor: "whiite" }, styles.skipbutton]}
                    onPress={() => {
                      setIsChoice5Image(false);
                      setIsAnswerImage(true);
                    }}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "grey" }, styles.buttonText]}>
                      SKIP
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}

        {isAnswerImage ? (
          <View>
            <Formik
              initialValues={{
                answer: "",
                title: "",
                choiceNumber: "",
              }}
              onSubmit={(values) => {
                values.title = "answer";
                uploadImageToServer(values);
              }}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                  }}
                >
                  <Text style={styles.head}>Answer</Text>
                  <Text style={styles.head}>If options were including images then please just enter the option number which is the answer.</Text>
                  <TextInput
                    style={[{ height: 40 }, styles.input]}
                    placeholder="Answer"
                    value={values.answer}
                    onChangeText={handleChange("answer")}
                    defaultValue={text}
                  />
                  {/* {img ? (
                    <Image source={{ uri: img }} />
                  ) : (
                    <Text style={styles.imagetxt} onPress={openImageLibrary}>
                      Upload an image
                    </Text>
                  )} */}
                  <Pressable
                    style={[{ backgroundColor: "#007bff" }, styles.button]}
                    onPress={handleSubmit}
                    android_ripple={{ color: "black" }}
                  >
                    <Text style={[{ color: "white" }, styles.buttonText]}>
                      SUBMIT
                    </Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        ) : (
          <></>
        )}
      </View>
      {progress ? <UploadProgress process={progress} /> : null}
      {showloader ? <Apploader /> : null}
    </>
  );
};

export default AddQuestionImage;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
  },
  head: {
    fontWeight: "bold",
    fontSize: 20,
  },
  imagetxt: {
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "grey",
    width: "50%",
    alignSelf: "center",
    opacity: 0.5,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  skipbutton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    paddingHorizontal: 9,
    alignSelf: "flex-end",
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
});
