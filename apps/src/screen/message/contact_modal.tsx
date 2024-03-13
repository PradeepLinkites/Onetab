import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from "react-native";

import Modal from "react-native-modal";
import rnfs from "react-native-fs";
import { Entypo } from "@expo/vector-icons";
import vCard from "react-native-vcards";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { uploadFiles } from "../../../store";
export const ContactModal = ({
  showContactModal,
  setShowContactModal,
  contact,
  setSelectedContact,
  ChannelInfo,
  setUploadData,
}) => {
  const refSearch = useRef<TextInput>(null);
  const [input, setInput] = useState<string>("");
  const [contactList, setContactList] = useState<any>(contact);
  const dispatch = useDispatch<Dispatch<any>>();
  useEffect(() => {
    //console.log("contact 2===> ",contact.length)
    setContactList(contact);
    //console.log("contactList ===> ",contactList.length)
  }, [contact]);

  const renderContact = ({ item }) => {
    return (
      <>
        <Pressable
          onPress={async () => {
            var contacts = vCard();
            contacts.firstName = item.firstName;

            contacts.lastName = item.lastName;
            contacts.cellPhone = item.phoneNumber[0].number!!;
            item.phoneNumber[1] !== undefined
              ? (contacts.workPhone = item.phoneNumber[1].number!!)
              : null;
            contacts.formattedName = item.name;
            contacts.nickname = item.name;
            const documentPath = rnfs.DocumentDirectoryPath;
            await contacts.saveToFile(`${documentPath}/eric-nesser.vcf`);
            console.log(
              "contact 1===> ",
              contacts,
              `${documentPath}/eric-nesser.vcf`
            );
            setUploadData([
              {
                type: "application/file",
                name: item.name,
                uri:
                  Platform.OS === "ios"
                    ? `${documentPath}/eric-nesser.vcf`?.replace("file://", "")
                    : `${documentPath}/eric-nesser.vcf`,
              },
            ]);
            dispatch(
              uploadFiles({
                file: {
                  type: "application/file",
                  name: `${item.name}.vcf`,
                  uri:
                    Platform.OS === "ios"
                      ? `${documentPath}/eric-nesser.vcf`?.replace(
                          "file://",
                          ""
                        )
                      : `${documentPath}/eric-nesser.vcf`,
                },
                roomId: ChannelInfo.matrixRoomInfo.roomId,
                id: item.name,
              })
            );
            setShowContactModal(false);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#3866E6",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                }}
              >
                {item.name.substring(0, 1).toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                marginLeft: 10,
              }}
            >
              <Text>{item.name}</Text>
              <Text>{item.phoneNumber[0].number!!}</Text>
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "#DEDEDE",
                  marginTop: 5,
                }}
              />
            </View>
          </View>
        </Pressable>
      </>
    );
  };

  return (
    <Modal
      isVisible={showContactModal}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowContactModal(false);
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0}
      onBackdropPress={() => {
        setShowContactModal(false);
      }}
      animationOut={"slideOutDown"}
      animationOutTiming={500}
      animationInTiming={500}
      animationIn={"slideInUp"}
      avoidKeyboard
      coverScreen={false}
    >
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              marginLeft: 10,
            }}
          >
            <Text style={styles.recentText}>Contact</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowContactModal(false);
            }}
            style={{
              marginLeft: 5,
              alignItems: "flex-end",
            }}
          >
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#DEDEDE",
          }}
        />

        {/* <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              ref={refSearch}
              value={input}
              placeholder="Search contact..."
              multiline={true}
              onChangeText={(text) => {
                setInput(text);
                if (text.length > 0) {
                  var newArray = contactList.filter(function (el) {
                    return el.name.toLowerCase().includes(text.toLowerCase());
                  });
                  setContactList(newArray);
                } else {
                  setContactList(contact);
                }
              }}
              style={{
                width: "85%",
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onFocus={() => {
                setModalInputFocus(true);
                console.log("onFocus");
                refSearch.current?.focus();
              }}
              onBlur={() => {
                console.log("onBlur");
                refSearch.current?.blur();
              }}
            />
            {input.length > 0 && (
              <Pressable
                onPress={() => {
                  setInput("");
                  setContactList(contact);
                }}
              >
                <MaterialIcons
                  name="cancel"
                  size={24}
                  color="black"
                  style={{
                    marginLeft: 10,
                  }}
                />
              </Pressable>
            )}
          </View>

          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#DEDEDE",
            }}
          />
        </View> */}

        <FlatList
          keyExtractor={(item: any) => item.id}
          data={contactList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => renderContact({ item })}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  view: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    margin: 0,
  },
  headerContainer: {
    width: "100%",
    height: "100%",
    marginTop: 40,
    backgroundColor: "#FFFFFF",
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
    marginLeft: 5,
  },
});
