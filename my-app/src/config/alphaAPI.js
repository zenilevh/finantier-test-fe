import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://www.alphavantage.co/query'
})

export const getDailyChartForSymbol = (symbol) => {
    return axiosInstance.get('', {
        params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval: '15min',
            outputsize: 'full',
            apikey: 'PB07DUG54TZG9OAJ'
        }
    })
}