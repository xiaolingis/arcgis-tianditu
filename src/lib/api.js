/**
 * Created by W on 2018-07-17 23:03.
 */
import axios from 'axios';
const ajaxUrl =  'http://localhost:8080/'
axios.defaults.baseURL = ajaxUrl;

let fetch = (url,params)=>{
    return new Promise ((resolve,rejected)=>{
        axios.post(url,params).then(result => {
            resolve(result);
        },reason => {
            rejected(reason)
        })
    })
}

export default {
    getData(url,params){
        return fetch(url,params)
    }
}
