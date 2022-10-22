import axios from 'axios'
//创建axios的一个实例 
var instance = axios.create({
	baseURL: '127.0.0.1', //接口统一域名
	timeout: 6000, //设置超时
	headers: {
		'Content-Type': 'application/json;charset=UTF-8;',
	}
})

//请求拦截器 
instance.interceptors.request.use((config) => {
		return config;
	}, (error) =>
	// 对请求错误做些什么
	Promise.reject(error)
);

//响应拦截器
instance.interceptors.response.use((response) => {
	return response.data;
}, (error) => {
	console.log(error)
	return Promise.reject(error);
});


export default instance;
