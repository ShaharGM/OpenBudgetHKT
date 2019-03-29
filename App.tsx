import * as React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Demo } from "./pages/Demo";
import { Search } from "./pages/Search";
import { ViewSingleCity } from "./pages/ViewSingleCity";

const AppNavigator = createStackNavigator({
  Demo,
  ViewSingleCity,
  Search
},
  {
    initialRouteName: "Search",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#1e51f4",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      }
    }
  });

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
