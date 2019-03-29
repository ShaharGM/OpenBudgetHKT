import * as React from "react";
import { Text, View, Button } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export class ViewSingleCity extends React.Component<NavigationScreenProps> {
    render() {
        const { navigation } = this.props;
        const cityId = navigation.getParam("cityId", "None");

        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>View Single City</Text>
                <Text>City Id: {JSON.stringify(cityId)}</Text>

                <Button
                    title="Go to Demo for graphical capabilities"
                    onPress={() => this.props.navigation.navigate("Demo")}
                />
            </View>
        );
    }
}
