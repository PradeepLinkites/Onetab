import React, { Component, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";

import Modal from "react-native-modal";

import { Entypo, MaterialIcons } from "@expo/vector-icons";

export const ContactModal = ({
  showContactModal,
  setShowContactModal,
  contact,
  setSelectedContact,
}) => {
  //console.log("contact 1===> ",contact.length)
  const refSearch = useRef<TextInput>(null);
  const [input, setInput] = useState<string>("");
  const [contactList, setContactList] = useState<any>(contact);

  useEffect(() => {
    //console.log("contact 2===> ",contact.length)
    setContactList(contact);
    //console.log("contactList ===> ",contactList.length)
  }, [contact]);

  const renderContact = ({ item }) => {
    return (
      <>
        <Pressable
          onPress={() => {
            setSelectedContact(item);
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
                {item.name.substring(0, 1)}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                marginLeft: 10,
              }}
            >
              <Text>{item.name}</Text>
              <Text>{item.phoneNumber}</Text>
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
