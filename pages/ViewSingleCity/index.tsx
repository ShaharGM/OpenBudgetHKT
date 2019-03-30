import * as React from "react";
import { StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationScreenProps, NavigationScreenConfig, NavigationStackScreenOptions } from "react-navigation";
import { getRedashQueryData } from "../../helpers/getRedashQueryData";
import { muniDataKeys, muniKeyToName, muniData } from "../../helpers/muniDetails";
import { Comparator } from "./Comparator";

export interface ViewSingleCityNavParams {
    cityId: string;
    cityName: string;
}

export interface ViewSingleCityState {
    muniData?: muniData;
    loading: boolean;
    comparisonVector?: muniDataKeys;
    baseSearchValue: number;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ecf0f1",
        padding: 8,
        height: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    muniDetails: {
        flex: 1,
        height: "50%",
        width: "100%"
    }
});

export class ViewSingleCity extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
        return {
            title: navigation.getParam("cityName", ""),
        };
    }

    state = {
        muniData: {},
        loading: true,
        comparisonVector: undefined,
        baseSearchValue: 0
    };

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const userCityID = this.props.navigation.getParam("cityId", "");
        if (!userCityID) {
            const error = "Tried to view single city with no cityId";
            console.warn(error);
            return this.props.navigation.navigate("Search");
        }

        try {
            const { data } = await getRedashQueryData<{ userCityID: number }>({
                redashURL: "https://app.redash.io/hasadna",
                userApiKey: "V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW",
                queryId: 185581,
                queryParams: { userCityID: Number(userCityID) }
            });
            if (1 !== data.rows.length) {
                const error = `Got more than one respone (${data.rows.length}) to id query`;
                console.warn(error);
                return this.props.navigation.navigate("Search");
            }
            return this.setState({
                loading: false,
                muniData: data.rows[0]
            });
        } catch (error) {
            console.warn((error as Error).message);
            return this.props.navigation.navigate("Search");
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.comparisonVector ? <Text>בחר/י בנתון מלמטה על מנת לצפות בערים עם ערכים הקרובים לנתון זה</Text> :
                    <Comparator
                        muniName={this.props.navigation.getParam("cityName", "")}
                        muniId={this.props.navigation.getParam("cityId", "")}
                        baseValue={this.state.baseSearchValue}
                        margin={5}
                        muniColumn={this.state.comparisonVector as unknown as muniDataKeys}
                        navigation={this.props.navigation}
                    />
                }
                {this.state.loading ?
                    <ActivityIndicator size="large" color="#0000dd" /> :
                    <FlatList
                        style={styles.muniDetails}
                        data={Object.keys(this.state.muniData).filter((key) => typeof this.state.muniData[key] === "number").sort()}
                        keyExtractor={(key) => key}
                        renderItem={
                            ({ item: muniKey }) => (<ListItem
                                title={muniKeyToName[muniKey]}
                                titleStyle={{ textAlign: "left" }}
                                badge={{ value: this.state.muniData[muniKey], left: 0 }}
                                onPress={() => this.setState({ comparisonVector: muniKey, baseSearchValue: this.state.muniData[muniKey] })}
                            />)
                        } />
                }
            </View>
        );
    }
}
