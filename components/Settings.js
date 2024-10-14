import React, { useRef, useState, useMemo, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { AuthContext } from "./Context/Authprovider";
import { Font } from "../common/font";
import { colors } from "./Theme";
const { height, width } = Dimensions.get("window");
import Switch from "../common/Switch";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const { user, UpdateUser, uid, darkMode } = useContext(AuthContext);
  const [hideTyping, setHideTyping] = useState(false);
  const [hideActive, setHideActive] = useState(false);
  const [hideLastseen, setHideLastseen] = useState(false);

  useEffect(() => {
    GetUserPreference("Active")
    GetUserPreference("Typing")
    GetUserPreference("Lastseen")
  }, [])

  const Info = [
    {
      name: "Hide active status",
      value: "Active",
      Desc: "Hiding your active status makes you invisible to others, and you won't see their active status either.",
    },
    {
      name: "Hide typing",
      value: "Typing",
      Desc: "Hiding your typing status hides others' typing status too.",
    },
    {
      name: "Hide last seen",
      value: "Lastseen",
      Desc: "Enabling this option hides your last seen and others too.",
    },
  ];

  const OnSwitch = (value) => {
    if (value === "Active") {
      setHideActive(!hideActive);
      SetUserPreference(value, !hideActive);
      UpdateUser(uid, { hideActive: !hideActive });
    }
    if (value === "Typing") {
      setHideTyping(!hideTyping);
      SetUserPreference(value, !hideTyping);
      UpdateUser(uid, { hideTyping: !hideTyping });
    }
    if (value === "Lastseen") {
      setHideLastseen(!hideLastseen);
      SetUserPreference(value, !hideLastseen);
      UpdateUser(uid, { hideLastseen: !hideLastseen });
    }
  };

  const SetUserPreference = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
      GetUserPreference(key)
    } catch (e) {
      console.log('Error storing data:', e);
    }
  };


  const GetUserPreference = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) {
        switch (key) {
          case "Active":
            setHideActive(false)
            UpdateUser(uid, { hideActive: false });
          case "Typing":
            setHideTyping(false)
            UpdateUser(uid, { hideTyping: false });
          case "Lastseen":
            setHideLastseen(false)
            UpdateUser(uid, { hideLastseen: false });
        }
      }
      if (value) {
        switch (key) {
          case "Active":
            if (value === "true") setHideActive(true)
            if (value === "false") setHideActive(false)
            return
          case "Typing":
            if (value === "true") setHideTyping(true)
            if (value === "false") setHideTyping(false)
            return
          case "Lastseen":
            if (value === "true") setHideLastseen(true)
            if (value === "false") setHideLastseen(false)
            return
        }
      }
    } catch (e) {
      console.log('Error reading data:', e);
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: Font.Medium,
        fontSize: 20,
        color: darkMode ? colors.WHITE : colors.BLACK,
      },
      headerStyle: {
        backgroundColor: darkMode ? colors.BLACK : colors.WHITE,
      },
      headerTintColor: darkMode ? colors.WHITE : colors.BLACK,
    });
  }, [navigation, darkMode]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: darkMode ? colors.BLACK : colors.WHITE,
      }}
    >
      {Info?.map((item, index) => {
        return (
          <View style={styles.MainView} key={index}>
            <View style={{ width: "80%" }}>
              <Text style={{ fontFamily: Font.Medium, color: darkMode ? colors.WHITE : colors.BLACK, fontSize: 15, }}>
                {item.name}
              </Text>
              <Text style={{ fontFamily: Font.Light, color: darkMode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontSize: 12, }}>
                {item.Desc}
              </Text>
            </View>
            <Switch
              onToggle={() => OnSwitch(item.value)}
              size={"medium"}
              isOn={
                item.value === "Active"
                  ? hideActive
                  : item.value === "Typing"
                    ? hideTyping
                    : item.value === "Lastseen"
                      ? hideLastseen
                      : null
              }
              onColor={colors.MAIN_COLOR}
              offColor={colors.SWITCH_BG}
              animationSpeed={300}
              thumbOnStyle={{ backgroundColor: colors.WHITE }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  MainView: {
    width: width - 5,
    paddingLeft: 10,
    height: 60,
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
