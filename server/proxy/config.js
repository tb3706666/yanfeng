

// 添加反向代理设置x-forwarded-for头信息
const rule4 = function (options) {
	return function (req, res, proxy) {
        const target = options.servers.shift();
        let opts = { target: target, headers: {}, secure: false };
        options.servers.push(target);
        req.headers.host = target.split('://')[1];
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin||"*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "*");

		// 通过代理指向分配的服务器
		proxy.web(req, res, opts);
	}
};


module.exports = {
	port: 80,
	rule: rule4,
	servers: [
        'https://www.baidu.com'
	]
};