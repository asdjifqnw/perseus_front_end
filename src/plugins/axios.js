"use strict";

import Vue from 'vue';
import axios from "axios";
import store from "../store"
import router from "vue-router"
import { Message } from 'element-ui';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl,
  // ||"http://139.199.110.7:443/api/forward/"
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);
_axios.interceptors.request.use(
  config => {
    if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = store.state.token;
      // config.headers['Content-Type'] = 'text/plain'
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  err => {
    // Do something with response error
    if(err.response.status == 401){
      Message({type:"error",message:"认证信息已过期，请重新登录."})
      store.commit("logoutSuccess")
      window.location.reload()
      return 
    }
    return Promise.reject(err);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
