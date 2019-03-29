import * as React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Constants } from 'expo';

export default class App extends React.Component {
    state = {
      data: []
    };
  
    componentWillMount() {
      this.fetchData();
    }
  
    fetchData = async () => {
      const response = await fetch("https://randomuser.me/api?results=500");
      const json = await response.json();
      this.setState({ data: json.results });
    };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          keyExtractor={(x, i) => i}
          renderItem={({ item }) =>
            <Text>
              {`${item.name.first} ${item.name.last}`}
            </Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});
