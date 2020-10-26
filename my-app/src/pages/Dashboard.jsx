import React, { useEffect, useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai';
import Stock from '../components/Stock'
import { Link } from 'react-router-dom'
import StockDetail from '../components/StockDetail';
import { getDailyChartForSymbol } from '../config/alphaAPI';
import axios from 'axios';


const DashBoard = () => {
    const [symbol, setsymbol] = useState("TSLA")
    const [searchInput, setsearchInput] = useState("")
    const [errorResponse, setErrorResponse] = useState(false);
    const [variationFlag, setVariationFlag] = useState(false);
    const [heavyLoadCondition, setheavyLoadCondition] = useState(false);
    const [companyDetail, setCompanyDetail] = useState(null);
    const [variationStock, setVariationStock] = useState(0);
    const [previousClose, setPreviousClose] = useState(0);
    const [variationPercentage, setvariationPercentage] = useState(0);
    const [stockChart, setStockChart] = useState([]);
    const [customStockData, setCustomStockData] = useState([]);

    const inputHandler = (e) => {
        let capitalSearch = e.toUpperCase();
        setsearchInput(capitalSearch);
    }

    const getSearch = (e) => {
        e.preventDefault();
        if (searchInput.length > 1) {
            setsymbol(searchInput)
        }
        setsearchInput("")
    }

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const result = await getDailyChartForSymbol(symbol);
                if (result.data.Information) {
                    console.log(result.data.Information);
                    setheavyLoadCondition(true)
                }
                setStockChart(formatStockData(result.data['Time Series (15min)']))
            } catch (err) {
                console.log(err);
                setErrorResponse(true)
            }

        }
        fetchStockData();
    }, [symbol])


    useEffect(() => {
        if (stockChart.length > 1) {
            const time = new Date(stockChart[0].time)
            const currentDate = time.getDate();
            const currentMonth = time.getMonth();
            const tempData = []
            stockChart.map(dataChart => {
                const tempDate = new Date(dataChart.time)
                if (currentMonth === tempDate.getMonth()) {
                    if (tempDate.getDate() === currentDate || tempDate.getDate() === currentDate - 1) {
                        tempData.push(dataChart)
                        if (tempDate.getDate() === currentDate - 1 && tempDate.getHours() === 20) {
                            setPreviousClose(dataChart.close)
                        }
                    }
                }
                return ""
            })
            setCustomStockData(tempData)
        }
    }, [stockChart, previousClose])

    useEffect(() => {
        if (companyDetail) {
            let variationStock = stockChart[0].open - companyDetail.price.regularMarketPreviousClose.raw
            setVariationStock(variationStock)
            if (variationStock < 0) {
                setVariationFlag(false)
            } else {
                setVariationFlag(true)
            }
            const variationPercentageCalculate = variationStock.toFixed(2) / stockChart[0].open
            const variationPercentageNumber = variationPercentageCalculate * 100
            setvariationPercentage(variationPercentageNumber.toFixed(2))
        }
    }, [companyDetail, stockChart])

    useEffect(() => {
        axios({
            "method": "GET",
            "url": "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "x-rapidapi-key": "18a04dd933mshba67927e4b81cc7p1cc041jsnf958553da754",
                "useQueryString": true
            }, "params": {
                "region": "US",
                "symbol": `${symbol}`
            }
        })
            .then((res) => {
                setCompanyDetail(res.data)
            })
            .catch((error) => {
                setErrorResponse(true)
                console.log(error);
            })
    }, [symbol])

    if (heavyLoadCondition) {
        return (
            <div className="container mt-5" style={{ fontSize: '20px' }} >
                <p>To Many Fetch Data With Free API...</p>
                <p>Please Wait A Moment Until We Can Fetch again, at least 5 minute waiting</p>
            </ div>
        )
    }
    if (stockChart === null || stockChart.length === 0 || companyDetail === null) {
        return (<div className="d-flex justify-content-center mt-5" style={{ fontSize: '50px' }} > <p>Please Wait A Moment...</p></ div>)
    }
    return (
        <div className="container mt-5">
            <div>
                <div style={{ lineHeight: '0.2', marginBottom: "20px" }} className="container row">
                    <div className=" d flex flex-wrap">
                        <div className="row">
                            <h4>{!errorResponse && companyDetail.quoteType.longName} </h4> <h4 style={{ fontWeight: "bolder" }}>&nbsp;({!errorResponse && companyDetail.symbol})</h4>
                        </div>
                        <p>{!errorResponse && companyDetail.price.exchangeName} - {!errorResponse && companyDetail.price.quoteSourceName}. Currency in {!errorResponse && companyDetail.financialData.financialCurrency}</p>
                    </div>
                    <div className="watchlist ml-4 pt-2">
                        <span> <AiOutlineStar id="star" /> <Link to="#">add to watchlist</Link></span>
                    </div>
                </div>
                <div style={{ lineHeight: '0.1' }} className="row">
                    <div className="col">
                        <div className="d flex flex-wrap row" >
                            <h2 style={{ fontWeight: 'bolder' }}>{stockChart[0].open} </h2><h2 style={{ color: variationFlag ? "green" : "red", fontSize: "1.5em" }}> {variationStock.toFixed(2)} ({variationPercentage}%)</h2>
                        </div>
                        <p>At close: {new Date(!errorResponse && companyDetail.price.postMarketTime).toLocaleTimeString()} GMT+7 </p>
                    </div>

                    <form onSubmit={(e) => getSearch(e)}>
                        {errorResponse && <label style={{ color: 'red', fontWeight: "500", paddingBottom: '6px' }}>Wrong Company Symbol, please try again</label>}
                        <div >
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Company Symbol ..." onChange={(e) => inputHandler(e.target.value)} value={searchInput} />
                        </div>
                        <button type="submit" style={{ display: "none" }}>Submit</button>
                    </form>
                </div>
            </div>
            <hr id="linebar" />
            <div className="row">
                <StockDetail dataCompany={companyDetail} previousClose={previousClose} stockChart={stockChart} />
                <Stock dataStock={customStockData} />
            </div>
        </div>
    )
}


function formatStockData(stockData) {
    return Object.entries(stockData).map(entries => {
        const [time, priceData] = entries;

        return {
            time,
            open: Number(priceData['1. open']),
            high: Number(priceData['2. high']),
            low: Number(priceData['3. low']),
            close: Number(priceData['4. close']),
        }
    })
}


export default DashBoard;