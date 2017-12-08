import React, { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connectAlert } from "../components/Alert";
import { connect } from "react-redux";
import { removeToken } from "../actions/authentication";
import { fetchNotifications } from "../actions/notifications";
import NotificationsItem from "../components/NotificationsItem/NotificationsItem";

import { colors, fontSizes, fontStyles } from "../../app/styles";
// import Moment from "../../node_modules/react-moment";
// import TimeAgo from "../../node_modules/react-native-timeago";

class Notifications extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
    notificationsError: PropTypes.string,
    items: PropTypes.array
  };
  constructor(props) {
    super(props);
    this.fetchNotificationsData = this.fetchNotificationsData.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchNotifications());
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.notificationsError &&
      nextProps.notificationsError !== this.props.notificationsError
    ) {
      this.props.alertWithType("error", "Error", nextProps.notificationsError);
    }
  }

  fetchNotificationsData() {
    this.props.dispatch(fetchNotifications());
  }

  handleRefresh = () => {
    this.fetchNotificationsData();
  };

  userLogout() {
    try {
      AsyncStorage.removeItem("id_token");
    } catch (error) {
      console.log("AsyncStorage error: " + error.message);
    }
    this.props.dispatch(removeToken());
    this.props.navigation.navigate("MainPage")
  }

  render() {
    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      if (this.props.items.length < 1) {
        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={this.fetchNotificationsData}
            >
              <Text style={styles.buttonText}>Get Notifications</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={this.userLogout.bind(this)}
        >
          <Text style={styles.buttonText}> Log out </Text>
        </TouchableOpacity>

        <FlatList
          data={this.props.items}
          renderItem={({ item }) => (
            <NotificationsItem item={item} navigation={this.props.navigation} />
          )}
          keyExtractor={(item, index) => index}
          refreshing={this.props.isLoading}
          onRefresh={this.handleRefresh}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white
  },
  container: {
    padding: 5,
    margin: 3,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: colors.white
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  buttonWrapper: {
    padding: 10
  }
});

const mapStateToProps = state => {
  const isAuthenticating = state.authentication.isAuthenticating;
  const isAuthed = state.authentication.isAuthed;
  const items = state.notifications.notifications;
  const isLoading = state.notifications.isLoading;

  return {
    isAuthenticating,
    isAuthed,
    items,
    isLoading,
    notificationsError: state.notifications.error
  };
};

export const userLogout = () => {
  try {
    AsyncStorage.removeItem("id_token");
  } catch (error) {
    console.log("AsyncStorage error: " + error.message);
  }
  // this.props.dispatch(removeToken());
  // Not Working
};

export default connect(mapStateToProps)(connectAlert(Notifications));
