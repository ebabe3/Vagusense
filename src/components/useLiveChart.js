import React from "react";
import { View } from "react-native";
import { LineChart, YAxis, Grid } from 'react-native-svg-charts'

export const useLiveChart = (data) => {
    return (
        <View style={{ height: 150, flexDirection: 'row', margin: 5 }}>
            <YAxis
                data={data}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={(value) => `${value}`}
            />

            <LineChart
                style={{ flex: 1, marginLeft: 16 }}
                data={data}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid />
            </LineChart>
        </View >

    );
}