import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Pressable,
  Platform,
} from "react-native";

import Modal from "react-native-modal";
import {
  Camera,
  Document,
  Gallery,
  Mic,
  ShareContact,
  VideoCamera,
} from "../../assets";

import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import * as Contacts from "expo-contacts";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { uploadFiles } from "../../../store";
interface MemberListDataType {
  id: string;
  url: string;
}

const memberList: MemberListDataType[] = [
  {
    id: "#1",
    url: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
  },
  {
    id: "#2",
    url: "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
  },
  {
    id: "#3",
    url: "https://fastly.picsum.photos/id/822/200/300.jpg?grayscale&hmac=SXusDri-Au-n4zgITd2yGgpMstjFToIlG6txy54KWFs",
  },
  {
    id: "#4",
    url: "https://fastly.picsum.photos/id/406/200/300.jpg?blur=5&hmac=b2jCKHnoJjHhRLp3ql28Z2TocOffe-H5z8aOHSuExVw",
  },
  {
    id: "#5",
    url: "https://fastly.picsum.photos/id/769/200/300.jpg?blur=2&hmac=oB_7owQB8XQbCIsjMnhUIVqoYTs8dx8x0T4aKOZw3-g",
  },
  {
    id: "#6",
    url: "https://fastly.picsum.photos/id/870/200/300.jpg?blur=2&grayscale&hmac=ujRymp644uYVjdKJM7kyLDSsrqNSMVRPnGU99cKl6Vs",
  },
  {
    id: "#7",
    url: "https://fastly.picsum.photos/id/76/200/300.jpg?hmac=SWpe2KMM2qFiQ8C8WHIZilaJb7KVkgOVVJPTbasGyUU",
  },
  {
    id: "#8",
    url: "https://fastly.picsum.photos/id/107/200/300.webp?hmac=kMXc37cTkUGnFrX50P0ADqdlGP1fR4s1AOv3vYEgUiE",
  },
];

interface MenuItemDataType {
  id: string;
  type: string;
  title: string;
}

const menuItemList: MenuItemDataType[] = [
  {
    id: "#1",
    type: "record_audio",
    title: "Record Audio",
  },
  {
    id: "#2",
    type: "record_video",
    title: "Record Video",
  },
  {
    id: "#3",
    type: "images",
    title: "Images",
  },
  {
    id: "#4",
    type: "documents",
    title: "Documents",
  },
  {
    id: "#5",
    type: "click_pickture",
    title: "Click Picture",
  },
  {
    id: "#6",
    type: "share_contact",
    title: "Share Contact",
  },
];

export interface ContactDataType {
  id: string;
  name: string;
  phoneNumber: Array<any>;
  lastName: string;
  firstName: string;
}

export const AttachmentModal = ({
  showModal,
  setShowModal,
  setSelectedUrl,
  imageData,
  setShowContactModal,
  setContactList,
  setSelectMimeType,
  setIsAudio,
  setDocResult,
  setUploadData,
  ChannelInfo,
  setDocumentState,
}) => {
  const dispatch = useDispatch<Dispatch<any>>();
  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn("cancelled");
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        "multiple pickers were opened, only the last will be considered"
      );
    } else {
      throw err;
    }
  };
  const requestContact = async () => {
    console.log("request");
    const { status } = await Contacts.requestPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        let contacts: any = [];
        for (let index = 0; index < data.length; index++) {
          console.log("Contact ===> ", data[index]);
          const element = data[index];
          if (element.phoneNumbers !== undefined) {
            let item: ContactDataType = {
              id: element.id,
              name: element.name,
              phoneNumber: element.phoneNumbers!!,
              firstName: element.firstName ?? "",
              lastName: element.lastName ?? "",
            };
            contacts.push(item);
          }
        }
        //console.log("Contact list count before ==> ", contacts.length);
        let namesArr = contacts.filter(
          (ele, ind) =>
            ind ===
            contacts.findIndex((elem) => elem.phoneNumber === ele.phoneNumber)
        );
        //console.log("Contact list count after ==> ", namesArr.length);
        setContactList(namesArr);
        setTimeout(() => {
          setShowContactModal(true);
        }, 100);
        setShowModal(false);
      }
    }
  };

  const clickRecord = async () => {
    let options: CameraOptions = {
      saveToPhotos: true,
      cameraType: "back",
      mediaType: "video",
    };
    const result = await launchCamera(options);
    if (result.didCancel) {
      console.log("User cancelled the slection");
    } else {
      if (result.assets !== undefined) {
        //console.log("Type ==> ", result.assets)
        let photo = result.assets[0].uri;
        setSelectMimeType("video");
        setSelectedUrl(photo);
        setShowModal(false);
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
        console.log("Type ==> ", result);
        let photo = result.assets[0].uri;
        setSelectMimeType("image");
        setSelectedUrl(photo);

        setShowModal(false);
      }
    }
  };

  const pickImage = async ({ type }) => {
    let options: ImageLibraryOptions = {
      mediaType: type === "gallery" ? "mixed" : "photo",
      // includeBase64: true,
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      console.log("User cancelled the slection");
    } else {
      if (result.assets !== undefined) {
        let photo = result.assets[0];
        if (photo.type?.includes("image/")) {
          console.log("Here 1");
          setSelectMimeType("image");
        } else {
          console.log("Here 2");
          setSelectMimeType("video");
        }
        console.log("Type ==> ", photo);

        dispatch(
          uploadFiles({
            file: {
              type: photo?.type,
              name: photo.fileName,
              uri:
                Platform.OS === "ios"
                  ? photo.uri?.replace("file://", "")
                  : photo.uri,
              size: photo.fileSize,
            },
            roomId: ChannelInfo.matrixRoomInfo.roomId,
            id: photo.fileName,
          })
        );
        setUploadData([photo]);
        // setSelectedUrl(photo.uri);
        setShowModal(false);
      }
    }
  };

  const renderMenu = ({ item }) => {
    return (
      <>
        <Pressable
          onPress={() => {
            if (item.type === "record_audio") {
              setIsAudio(true);
              setShowModal(false);
            } else if (item.type === "record_video") {
              clickRecord();
            } else if (item.type === "images") {
              pickImage({ type: "photo" });
            } else if (item.type === "documents") {
              DocumentPicker.pickMultiple({ copyTo: "cachesDirectory" })
                .then((value) => {
                  console.log("value ", value);
                  setUploadData(value);
                  value.map((item, index) =>
                    dispatch(
                      uploadFiles({
                        file: {
                          type: item?.type ?? "application/file",
                          name: item.name,
                          uri:
                            Platform.OS === "ios"
                              ? item.uri?.replace("file://", "")
                              : item.uri,
                          size: item.size,
                        },
                        roomId: ChannelInfo.matrixRoomInfo.roomId,
                        id: item.name,
                      })
                    )
                  );
                  !value[0]?.type && (value[0].type = "application/file");

                  setDocumentState(value);
                  // setDocResult(value);
                  setShowModal(false);
                })
                .catch(handleError);
            } else if (item.type === "click_pickture") {
              clickImage();
            } else {
              requestContact();
            }
          }}
          style={styles.menuListItemView}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            {
              {
                record_audio: <Mic />,
                record_video: <VideoCamera />,
                images: <Gallery />,
                documents: <Document />,
                click_pickture: <Camera />,
                share_contact: <ShareContact />,
              }[item.type]
            }
            <Text style={styles.settingItemTitle}>{item.title}</Text>
          </View>
        </Pressable>
      </>
    );
  };

  const renderImage = ({ item }) => {
    return (
      <>
        <Pressable
          onPress={() => {
            setSelectMimeType("image");
            dispatch(
              uploadFiles({
                file: {
                  type: item?.type,
                  name: item.fileName,
                  uri:
                    Platform.OS === "ios"
                      ? item.uri?.replace("file://", "")
                      : item.uri,
                  size: item.fileSize,
                },
                roomId: ChannelInfo.matrixRoomInfo.roomId,
                id: item.fileName,
              })
            );
            setUploadData([item]);
            // setSelectedUrl(item.url);
            setShowModal(false);
          }}
        >
          <View style={styles.memberViewContainer}>
            <Image style={styles.userPic} source={{ uri: item.url }} />
          </View>
        </Pressable>
      </>
    );
  };

  return (
    <Modal
      isVisible={showModal}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowModal(false);
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0}
      onBackdropPress={() => {
        setShowModal(false);
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      avoidKeyboard
      coverScreen={false}
    >
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerView}>
            <Text style={styles.recentText}>Recent</Text>

            <Pressable onPress={() => pickImage({ type: "gallery" })}>
              <Text style={styles.galleryText}>View gallery</Text>
            </Pressable>
          </View>

          <FlatList
            keyExtractor={(item: any) => item.id}
            data={imageData}
            horizontal={true}
            style={styles.flatlistRecenetView}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => renderImage({ item })}
          />

          <View style={styles.menuItemView} />

          <FlatList
            data={menuItemList}
            style={styles.menuFlatList}
            numColumns={3}
            renderItem={({ item, index }) => renderMenu({ item })}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#000000",
  },
  view: {
    width: "100%",
    justifyContent: "flex-end",
    margin: 0,
  },
  memberViewContainer: {
    width: 100,
    flexDirection: "column",
  },
  userPic: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  userNameView: {
    width: 60,
    alignItems: "center",
  },
  userName: {
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-Regular",
    color: "#171C26",
  },
  addPeopleView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  addPeopleContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addPeopleText: {
    color: "#3866E6",
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-SemiBold",
  },
  searchContainer: {
    width: "48%",
    height: 90,
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  settingItemTitle: {
    marginTop: 5,
    fontSize: 12,
    //fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3866E6",
  },
  headerContainer: {
    width: "100%",
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
  },
  headerView: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  recentText: {
    //fontFamily: "PlusJakartaSans-Medium",
    fontSize: 12,
    color: "#171C26",
  },
  galleryText: {
    //fontFamily: "PlusJakartaSans-Medium",
    fontSize: 12,
    color: "#3866E6",
  },
  flatlistRecenetView: {
    marginTop: 10,
    paddingLeft: 20,
  },
  menuItemView: {
    width: "100%",
    height: 1,
    marginTop: 10,
    backgroundColor: "#DEDEDE",
  },
  menuFlatList: {
    marginTop: 10,
    paddingStart: 15,
    paddingBottom: 40,
  },
  menuListItemView: {
    width: "30%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#E8F1FF",
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
