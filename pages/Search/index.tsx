import * as React from "react";
import { Text, View, Button, TextInput } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export class Search extends React.Component<NavigationScreenProps> {
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
                    onChangeText={(id) => this.setState({ id })}
                    value={this.state.id}
                />

                <Button
                    title={`Go to City with ID ${this.state.id}`}
                    onPress={() => this.props.navigation.navigate("ViewSingleCity", { cityId: this.state.id })}
                    disabled={!this.state.id}
                />
                <Button
                    title="Go to Demo for graphical capabilities"
                    onPress={() => this.props.navigation.navigate("Demo")}
                />
            </View>
        );
    }
}
