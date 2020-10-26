import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts'

const Stock = ({ dataStock }) => {
    const [stockChartOneDay, setStockChartOneDay] = useState([])
    useEffect(() => {
        if (dataStock) {
            setStockChartOneDay(dataStock)
        }
    }, [dataStock])

    if (stockChartOneDay.length === 0) {
        return (
            <div className="d flex justify-content-center align-items-center"><p>Now Loading</p></div>
        )
    }
    return (
        <div className="container col-lg-7" >
            <CanvasJSChart
                options={{
                    height: 390,
                    axisX: {
                        crosshair: {
                            enabled: true
                        }
                    }, axisY: {
                        minimum: Math.min(...stockChartOneDay.map(data => data.low)) / 1.1,
                        maximum: Math.max(...stockChartOneDay.map(data => data.high)) * 1.1,
                        crosshair: {
                            enabled: true
                        }
                    },
                    data: [
                        {
                            type: 'area',
                            dataPoints: stockChartOneDay.map(stockChart => ({
                                x: new Date(stockChart.time),
                                y: stockChart.open,
                            }))
                        }
                    ]
                }}
            />
        </div>
    )
}


export default Stock;