import Request from '@/js_sdk/luch-request/luch-request/index.js'
import {baseUrl} from '@/config/config.js'
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
		'ak-token':'ak_2kxt6D65giv4yNt4oa44SjW4jEXfoHMviPFvAreSEXvz25Q3QQ'
	};
	return config;
})
//请求成功后拦截器
http.interceptors.response.use(res => {
	if (res.data.code === 0) {
		if(res.config.custom.isToast){
			uni.showToast({
				icon: 'none',
				title: res.data.msg,
			});
		}
	}
	return res.data;
})
export default http;