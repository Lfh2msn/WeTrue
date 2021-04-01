export const getStore = function (key) {
	let value = uni.getStorageSync(key);
	if(value==''){
		return value;
	}else if(typeof value == "object"){
		return value;
	}else{
		return JSON.parse(value);
	}
}
export const setStore = function(key,value){
	uni.setStorageSync(key,JSON.stringify(value));
}