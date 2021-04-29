import Request from '@/js_sdk/luch-request/luch-request/index.js'
import {baseUrl} from '@/config/config.js'
import store from '../store/index.js'
import {
	getStore
} from '@/util/service'
var http = new Request({
	baseURL:baseUrl,
	custom:{
		isToast:false
	}
});
//请求前拦截器
http.interceptors.request.use(config=>{
	config.header={
		'Content-type': 'application/x-www-form-urlencoded',
		'ak-token':getStore('token')
	};
	if(!!getStore('keystore')){
		if(!store.state.user.password){
			uni.navigateTo({
				url:'/pages/login/password'
			})
		}
	}
	return config;
})
//请求成功后拦截器
http.interceptors.response.use(res => {
	if (res.data.code === 401) {
		uni.showToast({
			icon: 'none',
			title: res.data.msg,
		});
		setTimeout(()=>{
			uni.reLaunch({
			    url:'/pages/my/index'
			});
		},1000)
		
	}
	return res.data;
})
export default http;