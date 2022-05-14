import Axios from 'axios'

Axios.defaults.withCredentials = true

export const madadAxios = Axios.create({
    baseURL:'https://israel-api-games.herokuapp.com/madad'
})

madadAxios.interceptors.response.use(res => res,error => {
    console.log('error : ',error);
    return Promise.reject(error)
})