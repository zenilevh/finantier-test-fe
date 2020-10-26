import axios from 'axios';

export const iexFetch = (symbol) => {
    axios.get(`https://sandbox.iexapis.com/stable/stock/TSLA/book?token=Tsk_2bad1c509ef647f2a53a5f4636794d02`)
        .then(function({ data }) {
            console.log(data.quote);
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        })
}