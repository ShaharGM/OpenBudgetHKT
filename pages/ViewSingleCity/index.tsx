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

        // const jobResponse = await fetch(`https://app.redash.io/hasadna/api/queries/185581/results`, {
        //     method: "POST",
        //     headers: new Headers({
        //         "Content-Type": "application/json", // <-- Specifying the Content-Type
        //         "Authorization": `Key V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW`
        //     }),
        //     body: `{"id":185581,"parameters":{"userCityID":${userCityID}},"max_age":0}`
        // });

        // const jobResponseBody = await jobResponse.json();

        // if (!jobResponseBody
        //     || !jobResponseBody.job
        //     || "" !== jobResponseBody.job.error
        //     || !jobResponseBody.job.id) {
        //     const error = `Failed to start query job for cityId ${userCityID}.` +
        //         (jobResponseBody && jobResponseBody.job && jobResponseBody.job.error ?
        //             " " + JSON.stringify(jobResponseBody.job.error) :
        //             jobResponseBody && jobResponseBody.message ?
        //                 jobResponseBody.message : "");
        //     return this.props.navigation.navigate("Search", { error });
        // }

        // let resultId;
        // for (let i = 0; i < MAX_QUERY_RETRIES; i++) {
        //     const checkResponse = await fetch(`https://app.redash.io/hasadna/api/jobs/${jobResponseBody.job.id}`, {
        //         method: "GET",
        //         headers: new Headers({
        //             "Content-Type": "application/json", // <-- Specifying the Content-Type
        //             "Authorization": `Key V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW`
        //         })
        //     });
        //     const checkResponseBody = await checkResponse.json();
        //     if (checkResponseBody && checkResponseBody.job && checkResponseBody.job.query_result_id) {
        //         resultId = checkResponseBody.job.query_result_id;
        //         break;
        //     } else if (checkResponseBody
        //         && checkResponseBody.job
        //         && !checkResponseBody.job.error) {
        //         await setTimeout(() => undefined, 1500);
        //         continue;
        //     } else {
        //         const error = `Query job for cityId ${userCityID} failed. ${JSON.stringify(checkResponseBody)}` +
        //             (checkResponseBody && checkResponseBody.job && checkResponseBody.job.error ? JSON.stringify(checkResponseBody.error) :
        //                 checkResponseBody && checkResponseBody.message ? checkResponseBody.message : "");
        //         return this.props.navigation.navigate("Search", { error });
        //     }
        // }

        // const response = await fetch(
        //     `https://app.redash.io/hasadna/api/query_results/${resultId}`, {
        //         method: "GET",
        //         headers: new Headers({
        //             "Content-Type": "application/json", // <-- Specifying the Content-Type
        //             "Authorization": `Key V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW`
        //         })
        //     }
        // );
        // const data = await response.json();
        // if (!data
        //     || !data.query_result
        //     || !data.query_result.data
        //     || !data.query_result.data.rows
        //     || 0 === data.query_result.data.rows.length) {
        //     const error = `Recieved response in unexpected format ${JSON.stringify(data)}`;
        //     return this.props.navigation.navigate("Search", { error });
        // } else 
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
