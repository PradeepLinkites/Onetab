import {
  Text,
  StyleSheet,
  View,
  Pressable,
  Platform,
  StatusBar,
  Switch,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  Octicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  AntDesign,
} from "@expo/vector-icons";
import { Divider } from "../../components";

export const Preferences = () => {
  const navigation = useNavigation();
  const [isLocation, setIsLocation] = React.useState(false);
  const [isAnimated, setIsAnimated] = React.useState(false);
  const [isULink, setIsULink] = React.useState(false);
  const [isTypeIndicator, setIsTypeIndicator] = React.useState(false);
  const [isLink, setIsLink] = React.useState(false);
  const [isImgOptimize, setIsImgOptimize] = React.useState(false);
  const [isVidOptimize, setIsVidOptimize] = React.useState(false);
  const [isPreImage, setIsPreImage] = React.useState(false);
  const [isLog, setIsLog] = React.useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{ padding: 2 }}
        >
          <Ionicons name="chevron-back" size={26} color="#171C26" />
        </Pressable>
        <Text style={styles.headertitle}>Preferences</Text>
      </View>
      <Divider />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Time and place</Text>
          <View style={styles.buttonContainer}>
            <Octicons name="globe" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Language</Text>
              <Text style={styles.textSubHeader}>English (US)</Text>
            </View>
          </View>
          <View style={styles.switchView}>
            <Ionicons name="ios-hourglass-outline" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Set time zone automatically</Text>
              <Text style={styles.textSubHeader}>
                (UTC+05:30) Chennai. Kolkata. Mumbai. New Delhi
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsLocation(!isLocation)}
              value={isLocation}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            />
          </View>
        </View>
        <Divider />
        {/* <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Look and feel</Text>
          <View style={styles.buttonContainer}>
            <Ionicons name="ios-hand-left-sharp" size={24} color="#F3AD3C" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Default emoji skin tone</Text>
              <Text style={styles.textSubHeader}>hand</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={24}
              color="black"
            />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Dark mode</Text>
              <Text style={styles.textSubHeader}>System default</Text>
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Accessibility</Text>
          <View style={styles.switchView}>
            <SimpleLineIcons name="eyeglass" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>
                Allow animated images & emoji
              </Text>
              <Text style={styles.textSubHeader}>
                This only affects what you see
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsAnimated(!isAnimated)}
              value={isAnimated}
            />
          </View>
          <View style={styles.switchView}>
            <Octicons name="link" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Underline links</Text>
              <Text style={styles.textSubHeader}>
                Websites and hyperlinks will be underlined in conversations
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsULink(!isULink)}
              value={isULink}
            />
          </View>
          <View style={styles.switchView}>
            <MaterialCommunityIcons
              name="keyboard-outline"
              size={24}
              color="black"
            />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Display typing indicators</Text>
              <Text style={styles.textSubHeader}>
                See when someone is typing
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsTypeIndicator(!isTypeIndicator)}
              value={isTypeIndicator}
            />
          </View>
        </View>
        <Divider />
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Privacv & visibility</Text>
          <View style={styles.buttonContainer}>
            <Octicons name="lock" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>
                Wynn Connect discoverability
              </Text>
              <Text style={styles.textSubHeader}>
                Choose who can see that you use Wynn
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Advanced</Text>
          <View style={styles.switchView}>
            <Octicons name="link-external" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Open web pages in app</Text>
              <Text style={styles.textSubHeader}>
                Allow links to open in Wynn
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsLink(!isLink)}
              value={isLink}
            />
          </View>
          <View style={styles.switchView}>
            <Ionicons name="ios-speedometer-outline" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Optimize image uploads</Text>
              <Text style={styles.textSubHeader}>
                Images are optimized for upload performance
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsImgOptimize(!isImgOptimize)}
              value={isImgOptimize}
            />
          </View>
          <View style={styles.switchView}>
            <Ionicons name="ios-speedometer-outline" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Optimize video uploads</Text>
              <Text style={styles.textSubHeader}>
                Videos are optimized for upload performance
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsVidOptimize(!isVidOptimize)}
              value={isVidOptimize}
            />
          </View>
          <View style={styles.switchView}>
            <Ionicons name="image-outline" size={24} color="black" />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Show image previews</Text>
              <Text style={styles.textSubHeader}>
                Show previews of images and files
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsPreImage(!isPreImage)}
              value={isPreImage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name="person-outline" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Account Settings</Text>
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>Troubleshooting</Text>
          <View style={styles.buttonContainer}>
            <Octicons name="stack" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Reset cache</Text>
              <Text style={styles.textSubHeader}>
                Clear cached images, files, and data
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Feather name="tool" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Force stop</Text>
              <Text style={styles.textSubHeader}>Unsaved data may be lost</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <MaterialIcons name="feedback" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Send feedback and logs</Text>
              <Text style={styles.textSubHeader}>
                Let us know how we can improve
              </Text>
            </View>
          </View>
          <View style={styles.switchView}>
            <MaterialCommunityIcons
              name="phone-settings-outline"
              size={24}
              color="black"
            />
            <View style={styles.switchText}>
              <Text style={styles.textHeader}>Wynn calls debugging</Text>
              <Text style={styles.textSubHeader}>
                Let Wynn see logs when needed
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#65CD53" }}
              thumbColor={"#D9D9D9"}
              ios_backgroundColor="#B4B4B4"
              onValueChange={() => setIsLog(!isLog)}
              value={isLog}
            />
          </View>
          <View style={styles.buttonContainer}>
            <MaterialIcons name="help-outline" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Help center</Text>
              <Text style={styles.textSubHeader}>
                Support articles and tutorials
              </Text>
            </View>
          </View>
        </View>
        <Divider /> */}
        <View style={styles.contentStyle}>
          <Text style={styles.menuTitle}>About Wynn</Text>
          <View style={styles.buttonContainer}>
            <Entypo name="text-document" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Privacy policy</Text>
              <Text style={styles.textSubHeader}>
                How Wynn collects and uses information
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Entypo name="text-document" size={24} color="black" />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Open source licenses</Text>
              <Text style={styles.textSubHeader}>Libraries we use</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="black"
            />
            <View style={styles.buttonText}>
              <Text style={styles.textHeader}>Version</Text>
              <Text style={styles.textSubHeader}>1.00.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginBottom: 5,
  },
  headertitle: {
    //fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#171C26",
    marginLeft: 4,
  },
  contentStyle: { paddingHorizontal: 15 },
  menuTitle: {
    //fontFamily: "PlusJakartaSans-Medium",
    fontSize: 14,
    color: "#171C26",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  buttonText: {
    marginLeft: 20,
  },
  textHeader: {
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#171C26",
  },
  textSubHeader: {
    //fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#656971",
  },
  switchView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },
  switchText: { width: "70%" },
});
