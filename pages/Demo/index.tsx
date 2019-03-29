import * as React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { Constants, Svg } from "expo";
import { BarChart, Grid } from "react-native-svg-charts";

export interface BarChartChildProps<T> {
    x?: (x: number) => number;
    y?: (y: number) => number;
    width?: number;
    height?: number;
    bandwidth?: number;
    ticks?: number;
    data?: T[];
}

export interface DataPoint {
    name: {
        first: string;
        last: string;
    };
    dob: {
        date: string,
        age: number
    };
}

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
        justifyContent: "center",
        height: "80%"
    },
    container: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
        padding: 8,
        height: "100%"
    },
    graph: {
        height: "20%",
        flexDirection: "row",
        paddingVertical: 16
    }
});

export class Demo extends React.Component {
    state: {
        data: DataPoint[];
    } = {
            data: []
        };

    componentWillMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const response = await fetch("https://randomuser.me/api?results=8");
        const json = await response.json();
        this.setState({ data: json.results });
    }

    render() {
        const CUT_OFF = 20;
        const Labels = ({ x, y, bandwidth, data }: BarChartChildProps<DataPoint>) => (
            (!x || !y || !bandwidth || !data) ?
                null :
                <React.Fragment>
                    {
                        data.map(({ dob }, index) => (
                            <Svg.Text
                                key={index}
                                x={x(index) + (bandwidth / 2)}
                                y={dob.age < CUT_OFF ? y(dob.age) - 10 : y(dob.age) + 15}
                                fontSize={14}
                                fill={dob.age >= CUT_OFF ? "white" : "black"}
                                textAnchor={"middle"}
                            >
                                {dob.age}
                            </Svg.Text>
                        ))
                    }</React.Fragment>
        );

        return (
            <View style={styles.container}>
                <View style={styles.graph}>
                    {this.state.data && this.state.data.length > 0 ? <BarChart<DataPoint>
                        style={{ flex: 1 }}
                        data={this.state.data}
                        yAccessor={({ item }) => item.dob.age}
                        svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
                        contentInset={{ top: 10, bottom: 10 }}
                        gridMin={0}
                    >
                        <Grid direction={Grid.Direction.HORIZONTAL} />
                        <Labels />
                    </BarChart> : null}
                </View>
                <View style={styles.flatList}>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }: {
                            item: {
                                name: {
                                    first: string;
                                    last: string;
                                },
                                dob: {
                                    date: string,
                                    age: number
                                }
                            }
                        }) =>
                            <Text>
                                {`${item.name.first} ${item.name.last} - Age = ${item.dob.age}`}
                            </Text>}
                    />
                </View>
            </View >
        );
    }
}