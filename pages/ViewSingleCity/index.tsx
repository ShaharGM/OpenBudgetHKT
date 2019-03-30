import * as React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { Overlay, Button, ListItem } from "react-native-elements";
import { NavigationScreenProps, NavigationScreenConfig, NavigationStackScreenOptions } from "react-navigation";
import { getRedashQueryData } from "../../helpers/getRedashQueryData";
import { muniDataKeys, muniKeyToName } from "../../helpers/muniDetails";
import { FlatList } from 'react-native-gesture-handler';

type comparisonVector = "socialScore" | "populationSize";
export interface ViewSingleCityNavParams {
    cityId: string;
    cityName: string;
}

export interface ViewSingleCityState {
    muniData?: {
        [key in muniDataKeys]: string
    };
    loading: boolean;
    comparisonVector?: comparisonVector;
}
export class ViewSingleCity extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
        return {
            title: navigation.getParam("cityName", ""),
        };
    }

    state = {
        muniData: {},
        loading: true,
        comparisonVector: undefined
    };

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const userCityID = this.props.navigation.getParam("cityId", "");
        if (!userCityID) {
            const error = "Tried to view single city with no cityId";
            return this.props.navigation.navigate("Search", { error });
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
                return this.props.navigation.navigate("Search", { error });
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
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Overlay
                    isVisible={!this.state.comparisonVector}
                    windowBackgroundColor="rgba(255, 255, 255, .8)"
                    // overlayBackgroundColor="red"
                    width="auto"
                    height="auto"
                >
                    <View>
                        <Button title="השוואה לפי מדד סוציואקונומי"
                            onPress={() => this.setState({ comparisonVector: "socialScore" })} />
                        <Button title="השוואה לפי גודל אוכלוסיה"
                            onPress={() => this.setState({ comparisonVector: "populationSize" })} />
                    </View>
                </Overlay>
                {this.state.loading ?
                    <ActivityIndicator size="large" color="#0000dd" /> :
                    <FlatList
                        style={{ width: "100%" }}
                        data={Object.keys(this.state.muniData).sort()}
                        keyExtractor={(key) => key}
                        renderItem={
                            ({ item: muniKey }) => (<ListItem
                                title={muniKeyToName[muniKey]}
                                titleStyle={{ textAlign: "left" }}
                                badge={{ value: this.state.muniData[muniKey], left: 0 }}
                            />)
                        } />
                }
            </View>
        );
    }
}
