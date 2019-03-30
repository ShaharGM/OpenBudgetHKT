import * as React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { PieChart,BarChart, Grid, StackedBarChart } from 'react-native-svg-charts'
import { getRedashQueryData } from "../../helpers/getRedashQueryData";
import { NavigationScreenProps, NavigationScreenConfig, NavigationStackScreenOptions, ScrollView } from "react-navigation";

export class Compare extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
        return {
            title: navigation.getParam("cityName1", ""),
        };
    }

    state = {
        muniDataBase: undefined,
        muniDataCompare: undefined,
        loading: true
    };

    componentWillMount() {
        this.fetchData1();
        this.fetchData2();
    }

    fetchData1 = async () => {
        const userCityID = this.props.navigation.getParam("cityId1", "");
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
                muniDataBase: data.rows[0]
            });
        } catch (error) {
            console.warn((error as Error).message);
            return this.props.navigation.navigate("Search");
        }
    }

    fetchData2 = async () => {
        const userCityID = this.props.navigation.getParam("cityId2", "");
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
                muniDataCompare: data.rows[0]
            });
        } catch (error) {
            console.warn((error as Error).message);
            return this.props.navigation.navigate("Search");
        }
    }
    render() {
        if(this.state.loading || (this.state.muniDataBase == undefined || this.state.muniDataCompare == undefined)){
            return <ActivityIndicator size="large" color="#0000dd" />
        } else {
            
            const dataSocio = [ this.state.muniDataBase['index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most'],this.state.muniDataCompare['index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most'] ]
            const dataPop   = [ this.state.muniDataBase['total_population_end_2015_1000s'],this.state.muniDataCompare['total_population_end_2015_1000s']]
            const dataBudget = [ this.state.muniDataBase['total_expenses_of_municipality_budget_regular_1000s_nis_2015'],this.state.muniDataCompare['total_expenses_of_municipality_budget_regular_1000s_nis_2015']]
            const fill = 'rgb(134, 65, 244)'
            const colors =['blue', 'red']
            const keys = [1,2]
            
            const pieData1 = dataPop
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    svg: {
                        fill: colors[index],
                        onPress: () => console.log('press', index),
                    },
                    key: `pie-${index}`,
                }))
                const pieData2 = dataSocio
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    svg: {
                        fill: colors[index],
                        onPress: () => console.log('press', index),
                    },
                    key: `pie-${index}`,
                }))
                const pieData3 = dataBudget
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    svg: {
                        fill: colors[index],
                        onPress: () => console.log('press', index),
                    },
                    key: `pie-${index}`,
                }))

            return (
                <ScrollView>
                <React.Fragment>
                    <View>
                       <Text style = {{fontWeight: 'bold', textAlign: 'center', fontSize: 24, padding: 20}}>
                             {(this.state.muniDataBase['name_municipality'])} VS {(this.state.muniDataCompare['name_municipality'])}
                        </Text>
                    </View>
                    <View>
                        <PieChart
                            style={ { height: 200 } }
                            data={ pieData1 }
                        />
                        <Text>{(this.state.muniDataBase['name_municipality'])} Population: {JSON.stringify(dataPop[0])} thousands</Text>
                        <Text>{(this.state.muniDataCompare['name_municipality'])} Population: {JSON.stringify(dataPop[1])} thousands</Text>
                    </View>
                    <View>
                        <PieChart
                            style={ { height: 200 } }
                            data={ pieData2 }
                        />
                        <Text>{(this.state.muniDataBase['name_municipality'])} Socio-Eco Rating: {JSON.stringify(dataSocio[0])}</Text>
                        <Text>{(this.state.muniDataCompare['name_municipality'])} Socio-Eco Rating: {JSON.stringify(dataSocio[1])}</Text>
                    </View>
                    <View>
                        <PieChart
                            style={ { height: 200 } }
                            data={ pieData3 }
                        />
                        <Text>{(this.state.muniDataBase['name_municipality'])} Budget: {JSON.stringify(dataBudget[0])}</Text>
                        <Text>{(this.state.muniDataCompare['name_municipality'])} Budget: {JSON.stringify(dataBudget[1])}</Text>
                    </View>
                    
                </React.Fragment>
                </ScrollView>
            )
        }
    }
        
        // return (
        //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        //         {this.state.loading || (this.state.muniDataBase == undefined && this.state.muniDataCompare == undefined) ?
        //             <ActivityIndicator size="large" color="#0000dd" /> :
        //             (<React.Fragment>
        //                 <Text>City 1 data: {JSON.stringify(this.state.muniDataBase['index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most'])}</Text>
        //                 <Text>City 2 data: {JSON.stringify(this.state.muniDataCompare['index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most'])}</Text>
        //             </React.Fragment>)}
        //     </View>
        // );
    // }
}