import React from 'react';

const StockDetail = ({ dataCompany }) => {


    if (dataCompany.length === 0 || !dataCompany.price || !dataCompany.summaryDetail) {
        return (
            <div className="container mt-2 col-lg-5">
                <p>Loading... please Refresh again...</p>
            </div>
        )
    }

    return (
        <div className="container mt-2 col-lg-5">
            <div className="row">
                <div className="col detail-content">
                    <div className="row d flex justify-content-between">
                        <p>Open:</p> <b>{dataCompany.price.regularMarketOpen.fmt}</b>
                    </div>
                    <hr id="stockLine" />
                    <div className="row d flex justify-content-between">
                        <p>Previous Close: </p><b>{dataCompany.price.regularMarketPreviousClose.raw}</b>
                    </div>
                    <hr id="stockLine" />
                    <div className="row d flex justify-content-between">
                        <p>Bid: </p><b>{dataCompany.summaryDetail.bid.fmt} x {dataCompany.summaryDetail.bidSize.longFmt}</b>
                    </div>
                    <hr id="stockLine" />
                    <div className="row d flex justify-content-between">
                        <p>Ask: </p><b>{dataCompany.summaryDetail.ask.fmt} x {dataCompany.summaryDetail.askSize.longFmt}</b>
                    </div>
                    <hr id="stockLine" />
                    <div className="row d flex justify-content-between">
                        <p>Market Cap: </p><b>{dataCompany.price.marketCap.fmt}</b>
                    </div>
                    <hr id="stockLine" />
                    <div className="row d flex justify-content-between">
                        <p>Volume: </p><b>{dataCompany.price.regularMarketVolume.raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>
                    <hr id="stockLine" />
                </div>
                <div className="col detail-content ml-5">
                    <div className="row d flex justify-content-between">
                        <p>Avg Volume: </p><b>{dataCompany.price.averageDailyVolume3Month.raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>
                    <hr id="stockLine" />
                </div>

            </div>
        </div>
    )
}


export default StockDetail;