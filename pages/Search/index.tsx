import * as React from "react";
import { Text, View, Button, TextInput } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export class Search extends React.Component<NavigationScreenProps> {
    static navigationOptions = {
        title: "Search cities",
    };
    state = {
        id: "",
        searchString: ""
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>Search Screen</Text>
                <TextInput
                    style={{ width: "80%", height: 30, borderColor: "gray", borderWidth: 1 }}
                    onChangeText={(searchString) => this.setState({ searchString })}
                    value={this.state.searchString}
                />

                <Button
                    title={`Go to City with ID ${this.state.searchString}`}
                    onPress={() => this.props.navigation.navigate("ViewSingleCity",
                        { cityName: this.state.searchString, cityId: this.state.searchString })}
                    disabled={!this.state.searchString}
                />
                <Button
                    title="Go to Demo for graphical capabilities"
                    onPress={() => this.props.navigation.navigate("Demo")}
                />
            </View>
        );
    }
}
