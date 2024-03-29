import * as React from "react";
import { View, Button, FlatList, ActivityIndicator } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { ListItem, SearchBar } from "react-native-elements";
import { getRedashQueryData } from '../../helpers/getRedashQueryData';

interface MuniTableRow {
    entity_id: string;
    name_municipality: string;
}
interface SearchState {
    searchString: string;
    muniList: MuniTableRow[];
    loading: boolean;
}
export class Search extends React.Component<NavigationScreenProps, SearchState> {
    static navigationOptions = {
        title: "בחירת רשות",
    };
    state: SearchState = {
        searchString: "",
        muniList: [],
        loading: true
    };

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const { data }: { data: { rows: MuniTableRow[] } } = await getRedashQueryData({
                redashURL: "https://app.redash.io/hasadna",
                userApiKey: "V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW",
                queryId: 185508
            });
            return this.setState({
                loading: false,
                muniList:
                    data && data.rows
                        ? (data.rows as MuniTableRow[]).sort((a, b) =>
                            a.name_municipality < b.name_municipality ? -1 :
                                a.name_municipality > b.name_municipality ? 1 :
                                    0) : []
            });
        } catch (error) {
            return console.warn((error as Error).message);
        }
    }

    renderHeader = () => {
        return (
            <SearchBar
                inputStyle={{ textAlign: "center" }}
                placeholder="הקלד כאן..."
                lightTheme
                round
                onChangeText={(searchString) => this.setState({ searchString })}
                autoCorrect={false}
                value={this.state.searchString}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <FlatList
                    style={{ width: "100%" }}
                    data={this.state.muniList.filter(({ name_municipality }) =>
                        name_municipality.match(this.state.searchString))}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) =>
                        this.state.loading ? <ActivityIndicator size="large" color="#0000dd" /> : <ListItem
                            title={`${item.name_municipality}`}
                            onPress={() => this.props.navigation.navigate("ViewSingleCity",
                                {
                                    cityName: item.name_municipality,
                                    cityId: item.entity_id
                                })}
                            rightIcon={{ name: "chevron-left" }}
                            titleStyle={{ textAlign: "left" }}
                        />
                    }
                    ListHeaderComponent={this.renderHeader}
                    stickyHeaderIndices={[0]}
                />
                <Button
                    title="Go to Demo for graphical capabilities"
                    onPress={() => this.props.navigation.navigate("Demo")}
                />
                <Button
                    title="Go to Compare for graphical capabilities"
                    onPress={() => this.props.navigation.navigate("Compare", {
                        cityName1: 'תל אביב',
                        cityId1: '500250006',
                        cityName2: 'חיפה',
                        cityId2: '500240007'
                    })}
                />
            </View>
        );
    }
}
