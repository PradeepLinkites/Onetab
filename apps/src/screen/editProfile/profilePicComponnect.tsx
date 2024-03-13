import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Fontisto } from "@expo/vector-icons";
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import Modal from "react-native-modal";

export const ProfilePicEditoer = ({
  isModalVisible,
  dispatch,
  styles,
  uploadProfilePic,
  UpdateUserInfo,
  toggleModal,
}) => {
  const pickImage = async () => {
    let options: ImageLibraryOptions = {
      mediaType: "photo",
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      console.log("User cancelled the selection");
    } else {
      if (result.assets !== undefined) {
        console.log("Type ==> ", result);
        let photo = result.assets[0];
        if (photo.type?.includes("image/")) {
          console.log("Here 1");
          // setSelectMimeType("image");
        } else {
          console.log("Here 2");
          // setSelectMimeType("video");
        }
        // console.log("Type ==> ", photo);
        dispatch(
          uploadProfilePic({
            type: photo?.type,
            name: photo.fileName,
            uri:
              Platform.OS === "ios"
                ? photo.uri?.replace("file://", "")
                : photo.uri,
            size: photo.fileSize,
          })
        );

        // setSelectedUrl(photo.uri);
        // imageUrl = photo.uri;
        toggleModal();
        UpdateUserInfo();
        // setShowModal(false);
      }
    }
  };

  const clickImage = async () => {
    let options: CameraOptions = {
      saveToPhotos: true,
      cameraType: "back",
      mediaType: "photo",
    };
    const result = await launchCamera(options);
    if (result.didCancel) {
      console.log("User cancelled the slection");
    } else {
      if (result.assets !== undefined) {
        //console.log("Type ==> ", result.assets)
        let photo = result.assets[0];
        // setSelectMimeType("image");
        dispatch(
          uploadProfilePic({
            type: photo?.type,
            name: photo.fileName,
            uri:
              Platform.OS === "ios"
                ? photo.uri?.replace("file://", "")
                : photo.uri,
            size: photo.fileSize,
          })
        );
        // setSelectedUrl(photo);
        // setShowModal(false);
        toggleModal();
      }
    }
  };

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => toggleModal()}
        style={{ justifyContent: "flex-end", marginBottom: 50 }}
        onBackdropPress={() => toggleModal()}
        animationOut={"slideOutDown"}
        animationOutTiming={500}
        animationInTiming={500}
        animationIn={"slideInUp"}
      >
        <View
          style={{
            flex: 0.2,
            backgroundColor: "#ffffff",

            borderRadius: 10,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              //fontFamily: "PlusJakartaSans-ExtraBold",
              color: "#656971",
              fontSize: 18,
              marginTop: 10,
              letterSpacing: 0.1,
            }}
          >
            Upload a image
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginVertical: "5%",
            }}
          >
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => clickImage()}
            >
              <Feather
                name="camera"
                size={28}
                color="black"
                alignSelf={"center"}
              />
              <Text
                style={{
                  alignSelf: "center",
                  //fontFamily: "PlusJakartaSans-Light",
                  fontSize: 12,
                  marginVertical: 2,
                }}
              >
                Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                pickImage();
                console.log("picks image");
              }}
            >
              <Fontisto
                name="photograph"
                size={28}
                color="black"
                alignSelf={"center"}
              />
              <Text
                style={{
                  alignSelf: "center",
                  //fontFamily: "PlusJakartaSans-Light",
                  fontSize: 12,
                  marginVertical: 2,
                }}
              >
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              alignSelf: "center",
              //fontFamily: "PlusJakartaSans-ExtraBold",
              color: "#176FFC",
              fontSize: 12,
              marginTop: 1,
              letterSpacing: 0.1,
            }}
            onPress={() => toggleModal()}
          >
            Cancel
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({});
