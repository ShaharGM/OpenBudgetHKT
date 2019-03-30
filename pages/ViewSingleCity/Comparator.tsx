
import * as React from "react";
import { Text, Button } from "react-native-elements";
import { getRedashQueryData } from "../../helpers/getRedashQueryData";
import { muniDataKeys, muniKeyToName, muniData } from "../../helpers/muniDetails";
// import { Svg } from "expo";
// import { BarChart, Grid } from "react-native-svg-charts";
import { BarChartChildProps } from "../Demo";
import { StyleSheet, View, ActivityIndicator, Slider } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export interface BarChartChildProps<T> {
    x?: (x: number) => number;
    y?: (y: number) => number;
    width?: number;
    height?: number;
    bandwidth?: number;
    ticks?: number;
    data?: T[];
}

export interface ComparatorQueryParams {
    margin: number;
    baseValue: number;
    muniColumn: muniDataKeys;
}

export interface ComparatorProps extends ComparatorQueryParams, Pick<NavigationScreenProps, "navigation"> {
    muniName: string;
    muniId: string;
}

export interface ComparatorData extends Partial<muniData> {
    name_municipality: string;
    entity_id: string;
}

export interface ComparatorState extends Pick<ComparatorQueryParams, "margin" | "baseValue"> {
    rowData: ComparatorData[];
    loading: boolean;
}

const styles = StyleSheet.create({
    comparator: {
        height: "20%",
        flexDirection: "row",
        paddingVertical: 25
    }
});

const MAX_COMP_VALS = 5;

export class Comparator extends React.Component<ComparatorProps, ComparatorState> {
    constructor(props: ComparatorProps) {
        super(props);
        const { margin, baseValue } = props;
        this.state = {
            margin,
            baseValue,
            loading: true,
            rowData: []
        };
    }

    generateSelfMuniData = () => ({
        entity_id: this.props.muniId,
        name_municipality: this.props.muniName,
        [this.props.muniColumn]: this.props.baseValue
    })

    componentDidUpdate(prevProps: ComparatorProps, prevState: ComparatorState) {
        if (this.state.loading && (
            prevProps.baseValue !== this.props.baseValue ||
            prevState.baseValue !== this.state.baseValue ||
            prevProps.muniColumn !== this.props.muniColumn)) {
            this.fetchData();
            if (prevProps.baseValue !== this.props.baseValue && this.props.baseValue !== this.state.baseValue) {
                this.setState({
                    margin: this.props.margin,
                    baseValue: this.props.baseValue,
                });
            }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const { data } = await getRedashQueryData<ComparatorQueryParams>({
                redashURL: "https://app.redash.io/hasadna",
                userApiKey: "V7BqVSVSWEfr7ZIJUMNgrD5cUXBt8u1TC57aVDdW",
                queryId: 185668,
                queryParams: {
                    margin: Number(this.state.margin),
                    baseValue: Number(this.state.baseValue),
                    muniColumn: this.props.muniColumn
                },
                retries: 5
            });
            const rowData = [this.generateSelfMuniData(), ...(data && data.rows && data.rows.length > 0 ?
                data.rows.filter(({ entity_id }: { entity_id: string }) => Number(entity_id) !== Number(this.props.muniId)) : [])];
            this.setState({
                loading: false,
                rowData
            });
        } catch (error) {
            console.warn((error as Error).message);
        }
    }

    render() {
        const resData = this.state.rowData ?
            [...this.state.rowData]
                .filter(n => !!n || n === 0)
                .sort((a, b) => {
                    const aVal = a[this.props.muniColumn] as unknown as number;
                    const bVal = b[this.props.muniColumn] as unknown as number;
                    return (
                        Math.abs(aVal - this.state.baseValue) < Math.abs(bVal - this.state.baseValue) ?
                            -1 :
                            Math.abs(aVal - this.state.baseValue) > Math.abs(bVal - this.state.baseValue) ?
                                1 : 0
                    );
                }).slice(0, Math.min(this.state.rowData.length, MAX_COMP_VALS)) :
            [this.generateSelfMuniData()];

        return <React.Fragment>
            <Text h3={true} style={{ width: "100%", textAlign: "center" }}>
                השוואה לפי {muniKeyToName[this.props.muniColumn as unknown as string]}
            </Text>
            <View style={{
                marginLeft: 10,
                marginRight: 10,
                alignItems: "stretch",
                justifyContent: "center",
            }}>
                <Slider
                    style={{ width: 300 }}
                    step={1}
                    minimumValue={Math.abs(this.props.baseValue * 2) * -1}
                    maximumValue={Math.abs(2 * this.props.baseValue)}
                    value={this.state.baseValue}
                    onSlidingComplete={baseValue => this.setState({ baseValue, loading: true })}
                />
                <Text>ערך נוכחי: {this.state.baseValue}</Text>
            </View>
            {this.state.loading
                ? <ActivityIndicator size="large" color="#0000dd" />
                : <React.Fragment>
                    <View style={styles.comparator}>
                        {(resData as ComparatorData[])
                            .sort((a: any, b: any) =>
                                a[this.props.muniColumn] < b[this.props.muniColumn] ?
                                    -1 :
                                    a[this.props.muniColumn] > b[this.props.muniColumn] ?
                                        1 : 0
                            )
                            .map(({ entity_id, name_municipality, [this.props.muniColumn]: otherValue }) =>
                                (<Button
                                    buttonStyle={{ height: 100 * Math.abs(Number(otherValue) / this.state.baseValue) }}
                                    key={entity_id}
                                    title={name_municipality + (!!otherValue ? ("\n" + otherValue.toString()) : "")}
                                    onPress={() => this.props.navigation.navigate("Compare", {
                                        cityName1: this.props.muniName,
                                        cityId1: this.props.muniId,
                                        cityName2: name_municipality,
                                        cityId2: entity_id
                                    })} />))}
                    </View>
                </React.Fragment>
            }
        </React.Fragment>;
    }
}