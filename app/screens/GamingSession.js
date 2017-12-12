import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Button,
  Image,
  KeyboardAvoidingView,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import Chat from "../components/Chat/Chat";

import PlayersList from "../components/PlayersList/PlayersList";
import { colors, fontSizes, fontStyles } from "../styles";
import Moment from "../../node_modules/react-moment";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { connectAlert } from "../components/Alert";

// Moment.globalFormat = "h:mm";
Moment.globalLocale = "en";

class GamingSession extends React.Component {
  static navigationOptions = () => {
    // headerTitle: "Game";
    // Not Working
  };

  constructor(props) {
    super(props);
    this.state = {
      hasJoined: false,
      isLoading: true,
      refreshing: false,
      gameData: ""
    };
    gamingSessionId = this.props.navigation.state.params.gamingSessionId;
  }

  componentDidMount() {
    this.fetchGamingSessionData();
  }

  fetchGamingSessionData() {
    var userIds = [];
    return fetch(
      "https://pwn-staging.herokuapp.com/api/v2/gaming_sessions/" +
        gamingSessionId
    )
      .then(response => response.json())
      .then(responseJson => {
        responseJson.confirmed_sessions.map(confirmedSession =>
          userIds.push(confirmedSession.user_id)
        );
        this.setState({
          isLoading: false,
          hasJoined: userIds.includes(this.props.user.user_id),
          dataSource: responseJson
        });
        console.log(responseJson);
        return responseJson;
      })
      .catch(error => {
        console.error(error);
      });
  }

  joinGame = () => {
    console.log("JOIN CLICKED");
    this.postData("/join");
  };

  leaveGame = () => {
    console.log("LEAVE CLICKED");

    this.postData("/leave");
  };

  postData(action) {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("id_token").then(token => {
      console.log("token: " + token);
      fetch(
        "https://pwn-staging.herokuapp.com/api/v2/gaming_sessions/" +
          gamingSessionId +
          action,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          this.props.navigation.goBack();
          console.log("GAME JOINED OR LEFT");
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>
            {this.state.dataSource.category != null
              ? this.state.dataSource.category.toString()
              : ""}
          </Text>
          <JoinLeaveButton
            hasJoined={this.state.hasJoined}
            leaveGame={this.leaveGame}
            joinGame={this.joinGame}
          />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {this.state.dataSource.name != null
            ? this.state.dataSource.name.toString()
            : ""}
        </Text>
        <View style={styles.iconBar}>
          <TimeIcon startTime={this.state.dataSource.start_time} />
          <PlatformIcon platform={this.state.dataSource.platform} />
          <PlayerIcon
            primaryUsersCount={this.state.dataSource.primary_users_count}
            teamSize={this.state.dataSource.team_size}
          />
          <PowerIcon lightLevel={this.state.dataSource.light_level} />
          <SherpaIcon sherpaLed={this.state.dataSource.sherpa_led} />
        </View>
        <PlayersList
          confirmedSessions={this.state.dataSource.confirmed_sessions}
          navigation={this.props.navigation}
        />
        {/* <Chat
          chatroom={"help_chatroom"}
          room="help_chatroom"
          style={{ flex: 5 }}
        /> */}
      </View>
    );
  }
}

export function JoinLeaveButton(props) {
  if (props.hasJoined) {
    return (
      <Button
        style={{
          height: 30,
          width: 180,
          marginBottom: 15
        }}
        onPress={() => props.leaveGame()}
        title="Leave"
      />
    );
  } else {
    return (
      <Button
        style={{
          height: 30,
          width: 180,
          marginBottom: 15
        }}
        onPress={() => props.joinGame()}
        title="Join"
      />
    );
  }
}

function PlatformIcon(props) {
  if (props.platform === "ps4") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="playstation"
          size={14}
          color={colors.grey}
        />
        PS4
      </Text>
    );
  } else if (props.platform === "xbox-one") {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="xbox" size={14} color={colors.grey} />
        XBOX
      </Text>
    );
  } else {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons
          name="microsoft"
          size={14}
          color={colors.grey}
        />
        PC
      </Text>
    );
  }
}

function TimeIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="calendar" size={14} color={colors.grey} />

      <Moment format="hh:mm A  MM/DD/YY" element={Text}>
        {props.startTime.toString()}
      </Moment>
    </Text>
  );
}

function PlayerIcon(props) {
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="account" size={14} color={colors.grey} />
      {props.primaryUsersCount}/{props.teamSize}
    </Text>
  );
}

function PowerIcon(props) {
  if (props.lightLevel) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
        {props.lightLevel}
      </Text>
    );
  }
  return (
    <Text style={styles.icon}>
      <MaterialCommunityIcons name="gauge" size={14} color={colors.grey} />
      Any
    </Text>
  );
}

function SherpaIcon(props) {
  if (props.sherpaLed) {
    return (
      <Text style={styles.icon}>
        <MaterialCommunityIcons name="security" size={14} color={colors.grey} />
        Sherpa-Led
      </Text>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  keyboardView: {
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.grey
  },
  container: {
    padding: 5,
    paddingTop: 30,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
  iconBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    backgroundColor: colors.white
  },
  icon: {
    padding: 2,
    margin: 2,
    backgroundColor: colors.white
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5
  },

  title: {
    padding: 5,
    color: colors.grey,
    fontFamily: fontStyles.primaryFont,
    fontSize: fontSizes.primary
  },
  description: {
    padding: 5,
    color: colors.lightGrey,
    fontSize: fontSizes.secondary
  }
});

const mapStateToProps = state => {
  const user = state.authentication.user;

  return {
    user
  };
};

export default connect(mapStateToProps)(connectAlert(GamingSession));
