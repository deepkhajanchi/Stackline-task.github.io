import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "../actions";
import {Line, LineChart, Tooltip, XAxis} from "recharts";

class ChartComponent extends Component {
    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        return (
            <div>
                <h3>Retail Sales</h3>
                <LineChart width={950} height={300} data={this.props.Data}>
                    <XAxis dataKey="weekEnding" tickLine={false} axisLine={{ stroke: 'rgba(234,240,244,0.01)' }}/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="salesPerMonth" stroke="#6b6b6a" strokeWidth={2.5}  />
                    <Line type="monotone" dataKey="wholesalesPerMonth" stroke="#2b54e3" strokeWidth={2.5}  />
                </LineChart>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    const data = state.Data.sales;

    const collection = data.map(x => ({ ...x, weekEnding: parseInt(x.weekEnding.split("-")[1],10), retailSales: Number(x.retailSales), wholesaleSales: Number(x.wholesaleSales)}));

    const retailSalesPerMonth = collection.reduce((acc, cur) => {
        acc[cur.weekEnding] = acc[cur.weekEnding] + cur.retailSales || cur.retailSales;
        return acc;
    }, {})

    const wholesaleSalesPerMonth = collection.reduce((acc, cur) => {
        acc[cur.weekEnding] = acc[cur.weekEnding] + cur.wholesaleSales || cur.wholesaleSales;
        return acc;
    }, {})

    const finalData = []
    const months = {0: "", 1:"JAN", 2:"FEB", 3:"MAR", 4:"APR", 5:"MAY", 6:"JUN", 7:"JUL", 8:"AUG", 9:"SEP", 10:"OCT", 11:"NOV", 12:"DEC"};

    for (let i = 0, keys = Object.keys(months), j = keys.length; i < j; i++) {
        let updatedData = {"weekEnding":months[keys[i]],"salesPerMonth":retailSalesPerMonth[keys[i]],"wholesalesPerMonth":wholesaleSalesPerMonth[keys[i]]}
        finalData.push(updatedData)
    }
    return {Data: finalData};
};

export default connect(mapStateToProps,{fetchData})(ChartComponent);
