import React, { Component, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import Modal from "react-native-modal";

import { Ionicons } from "@expo/vector-icons";

import { Video, ResizeMode } from "expo-av";
import { BackIcon } from "../../assets/svg";

export const PreviewModal = ({
  showPreviewModal,
  setShowPreviewModal,
  uri,
  type,
  contact,
}) => {
  const openDialpad = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Modal
      isVisible={showPreviewModal}
      testID={"modal"}
      onSwipeComplete={() => {
        setShowPreviewModal(false);
      }}
      swipeDirection={["down"]}
      style={styles.view}
      backdropOpacity={0}
      onBackdropPress={() => {
        setShowPreviewModal(false);
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
            alignContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowPreviewModal(false);
            }}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.recentText}>Preview</Text>
        </View>
        {
          {
            image: (
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
                source={{ uri: uri }}
              />
            ),
            video: (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  marginBottom: 10,
                }}
              >
                <Video
                  style={{
                    width: "100%",
                    height: "90%",
                  }}
                  source={{
                    uri: uri,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  onPlaybackStatusUpdate={(status) => {}}
                />
              </View>
            ),
            contact: (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    marginRight: 20,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
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
                            {contact !== undefined &&
                              contact.name !== undefined &&
                              contact.name.substring(0, 1)}
                          </Text>
                        </View>

                        <Text
                          style={{
                            marginLeft: 10,
                            color: "#000000",
                            fontSize: 14,
                            //fontFamily: "PlusJakartaSans-Regular",
                          }}
                        >
                          {contact !== undefined &&
                            contact.name !== undefined &&
                            contact.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => openDialpad(contact.phoneNumber)}
                        >
                          <View
                            style={{
                              backgroundColor: "#3866E6",
                              width: 30,
                              height: 30,
                              borderRadius: 18,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons name="call" size={14} color="#FFFFFF" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "#DEDEDE",
                        marginTop: 15,
                      }}
                    />
                    <View
                      style={{
                        marginTop: 5,
                        marginLeft: 50,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: 20,
                          ////fontFamily: "PlusJakartaSans-Bold",
                        }}
                      >
                        {contact !== undefined &&
                          contact.phoneNumber !== undefined &&
                          contact.phoneNumber}
                      </Text>
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: 12,
                          //fontFamily: "PlusJakartaSans-Regular",
                        }}
                      >
                        Mobile
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ),
          }[type]
        }
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
    justifyContent: "flex-end",
    margin: 0,
  },
  headerContainer: {
    width: "100%",
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
