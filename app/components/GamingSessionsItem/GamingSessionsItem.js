import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ListView,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { StackNavigator } from "react-navigation";

import PreSplash from "../../components/PreSplash/PreSplash";
import { colors, fontSizes, fontStyles } from "../../styles";
import Moment from "../../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import JoinLeaveButton from "../../screens/GamingSession";

Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

function IconDetail({icon, children}) {
  return (
    <View style={styles.iconDetail}>
      <MaterialCommunityIcons
        name={icon}
        size={12}
        color={colors.mediumGrey}
      />

      <Text style={styles.iconText}>{children}</Text>
    </View>
  );
}

export default function GamingSessionItem(props) {
  return (
    <TouchableHighlight
      onPress={() =>
        props.navigation.navigate("GamingSession", {
          gamingSessionId: props.data.id
          // headerRight: (
          //   <Button
          //     style={{
          //       height: 30,
          //       width: 180,
          //       marginBottom: 15
          //     }}
          //     onPress={() => this.joinGame()}
          //     title="Join"
          //   />
          // )
        })}
      underlayColor="white"
    >
      <View style={styles.box}>
        <View style={styles.leftBox}>
          <Image
            style={styles.avatarMini}
            source={
              props.data.game_avatar_url === "img/default-avatar.png"
                ? require("../../assets/images/default-avatar.png")
                : { uri: props.data.game_avatar_url }
            }
          />
          <Text style={styles.groupNameText}>{props.data.clan_tag}</Text>
        </View>

        <View style={styles.middleBox}>
          <Text style={styles.gamingSessionTitle}>{props.data.category}</Text>
          <Text style={styles.gamingSessionDescription} numberOfLines={2}>
            {props.data.name}
          </Text>
        </View>

        <View style={styles.rightBox}>
          <IconDetail icon="calendar">
            <Moment format="h:mma" element={Text}>
              {props.data.start_time}
            </Moment>
          </IconDetail>

          <IconDetail icon="account">
            {props.data.primary_users_count}/{props.data.team_size}
          </IconDetail>

          <IconDetail icon="gauge">
            {props.data.light_level === null ? "any" : props.data.light_level}
          </IconDetail>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  box: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingBottom: 12,
    paddingTop: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  leftBox: {
    paddingTop: 2,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.white,
  },
  middleBox: {
    flex: 1,
    marginRight: 16,
    backgroundColor: colors.white,
    marginTop: 2,
  },
  rightBox: {
    justifyContent: "flex-start",
    marginTop: 2,
  },
  avatarMini: {
    height: 40,
    width: 40,
    borderRadius: 20
  },
  gamingSessionTitle: {
    fontSize: 16,
    color: colors.grey,
    fontFamily: fontStyles.gameHeaderFont,
    paddingBottom: 5,
  },
  gamingSessionDescription: {
    color: colors.lightGrey
  },
  groupNameText: {
    paddingTop: 2,
    fontSize: fontSizes.small,
    color: colors.lightestGrey
  },
  iconDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  iconText: {
    fontSize: fontSizes.small,
    color: colors.mediumGrey,
    marginLeft: 4,
  },
});
