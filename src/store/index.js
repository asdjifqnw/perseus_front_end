import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const module = {
        state: {
                newArticle: false,
                token: "",
                userInfo: {
                        admin:"",
                        createDate: "",
                        enabled:"",
                        id:"",
                        locked:"",
                        modifyDate: "",
                        username: ""
                },
                userId:""
        },
        getters: {},
        mutations: {
                loginSuccess(state, token) {
                        state.token = token
                },
                logoutSuccess(state) {
                        state.token = ""
                        for(let i in state.userInfo){
                                state.userInfo[i]=""
                        }
                },
                setUserInfo(state,userInfo){
                        state.userInfo = userInfo
                },
                setUserId(state,userId){
                        state.userId = userId
                }
               
        },
        plugins: [createPersistedState()]
}
const store = new Vuex.Store(module)
export default store