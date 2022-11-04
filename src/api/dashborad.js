import {postAction} from './action.js'

export const getLoginList = ()=>{
    return postAction(`/api/log/logSuccess`)
}