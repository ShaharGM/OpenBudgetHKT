import * as React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationScreenProps, NavigationScreenConfig, NavigationStackScreenOptions } from "react-navigation";
import { getRedashQueryData } from "../../helpers/getRedashQueryData";

export interface ViewSingleCityNavParams {
    cityId: string;
    cityName: string;
}

type muniDataKeys = | "name_municipality"
    | "index_socioeconomic_2013_rating_from_1_to_255_1_lowest_most"
    | "avg_students_per_class_total_2015_2014/15"
    | "balance_immigration_total_2015"
    | "cars_private_total_2015"
    | "births_live_2015"
    | "deaths_2015"
    | "income_avg_monthly_of_freelancers_in_2014_nis"
    | "index_inequality_employees_index_gini_0_equality_full_in_2014"
    | "jews_pct_2015"
    | "arab_pct_2015"
    | "muslim_pct_2015"
    | "druse_pct_2015"
    | "christian_pct_2015"
    | "total_population_end_2015_1000s"
    | "uses_land_number_all_area_jurisdiction_km2"
    | "total_expenses_of_municipality_budget_regular_1000s_nis_2015";
export interface ViewSingleCityState {
    muniData?: {
        [key in muniDataKeys]: string
    };
    loading: boolean;
}
export class ViewSingleCity extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
        return {
            title: navigation.getParam("cityName", ""),
        };
    }

    state = {
        muniData: undefined,
        loading: true
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
                {this.state.loading ?
                    <ActivityIndicator size="large" color="#0000dd" /> :
                    <Text>City data: {JSON.stringify(this.state.muniData)}</Text>}
            </View>
        );
    }
}
