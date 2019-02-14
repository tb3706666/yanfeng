
const config = require('../configs/config');

const utils = require('chestnut-utils');

const dbConfig = config.database[config.dbType];

module.exports = {
    getConnection(){
        return utils.db(dbConfig);
    },
    /**
     * 
     * @param {*} countSQL 总条数查询语句
     * @param {*} listSQL  当前页查询语句
     * @param {*} params   查询语句对应的参数数组
     * @param {*} opts     {pageNum(页码), pageSize(每页条数)}
     * 
     * @return {total: (总条数), list: (数据数组), pageSize: (页码), pageNum: (每页条数)}
     */
    async getPageInfo(countSQL, listSQL, params, opts){
        opts = formatPageInfo(opts);
        const db = this.getConnection();
        
        const rsCount = await db.query(countSQL, params), total = rsCount.error?0:((rsCount[0]||{}).count || 0);
        if(rsCount.error) console.error(rsCount.error);
        opts.pageSize = opts.pageSize,
        opts.pageNum = opts.pageNum;

        if(!total){
            return {
                total: 0,
                list: [],
                pageSize: opts.pageSize,
                pageNum: opts.pageNum
            }
        }

        listSQL = [listSQL, 'LIMIT '+opts.pageSize, 'OFFSET '+(opts.pageNum-1)*opts.pageSize].join(' ');

        let list = await db.query(listSQL, params);

        if(list.error){
            console.error(list.error);
            list = [];
        }

        return {
            total: total,
            list: list,
            pageSize: opts.pageSize,
            pageNum: opts.pageNum
        }

    },

    /**
     * 用于count list 参数分开
     * @param {*} countSQL 总条数查询语句
     * @param {*} listSQL  当前页查询语句
     * @param {*} params   查询语句对应的参数数组
     * @param {*} opts     {pageNum(页码), pageSize(每页条数)}
     * 
     * @return {total: (总条数), list: (数据数组), pageSize: (页码), pageNum: (每页条数)}
     */
    async getPageInfoSub(countSQL, listSQL, paramsCount,params, opts){
        opts = formatPageInfo(opts);
        const db = this.getConnection();
        
        const rsCount = await db.query(countSQL, paramsCount), total = rsCount.error?0:((rsCount[0]||{}).count || 0);
        if(rsCount.error) console.error(rsCount.error);
        if(!total){
            return {
                total: 0,
                list: [],
                pageSize: opts.pageSize,
                pageNum: opts.pageNum
            }
        }

        listSQL = [listSQL, 'LIMIT '+opts.pageSize, 'OFFSET '+(opts.pageNum-1)*opts.pageSize].join(' ');

        let list = await db.query(listSQL, params);

        if(list.error){
            console.error(list.error);
            list = [];
        }

        return {
            total: total,
            list: list,
            pageSize: opts.pageSize,
            pageNum: opts.pageNum
        }

    },
    /**
     * 统一创建uuid
     */
    createUUID(){
        const uuid = require('uuid/v4');
        return uuid().toLowerCase().replace(/\-/g, '');
    },
    /**
     * 进行md5加密
     */
    md5 (str) {
        const crypto = require('crypto');
        const md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },
    /**
     *将需要相同条件值的查询条件转换为OR语句，比如共享的搜索框可以输入一个值来同时匹配手机号、email等字段
     * @param {string} str      [要求查询的字段使用$隔开，仅有一个的时候也需要使用$，比如：org_name$org_code代表机构名称和机构代码]
     * @param {string} v        [查询条件值，所有字段以此值进行模糊匹配]
     * @param {string} append   [需要添加的表格别名，有时候查询是多表查询，目前此处只支持指定某个表的别名，不支持多个表的别名，没有此参数则不加]
     * @return 比如 : DB.formatOR('org_name$org_code', '111', 'a') => {line: '(org_name=? OR org_code=?)', params:['111', '111']}
     */
    formatOR(str, v, append){
        if(!v) return {
            params: []
        }
        const strs = str.split('$');
        const line = [], params = [];
        strs.forEach(function(k){
            line.push((append?append+'.':'')+k+" LIKE ?");
            params.push("%"+v+"%");
        });
        return {
            line: '('+line.join(' OR ')+')',
            params: params
        }
    },
    /**
     *将一组对象拆分为以AND条件连接的条件语句
     * @param {Object}    pageInfo   [要求查询的字段，如果字段包含$关键字，等于pageNum或者pageSize则该字段将忽略]
     * @param {string}    append     [需要添加的表格别名，有时候查询是多表查询，目前此处只支持指定某个表的别名，不支持多个表的别名，没有此参数则不加]
     * @return 比如 : DB.formatAnd({admin_status: '0', admin_name: 'admin'}, 'a') => {line: '(admin_status=? AND admin_name=?)', params:['0', 'admin']}
     */
    formatAnd(pageInfo, append){
        pageInfo = pageInfo || {};
        const line = [], params = [];
        for(let k in pageInfo){
            if(k==='orderby') continue;
            if(k===null||k===''||k===undefined||k.indexOf('$')>-1||k==='pageSize'||k==='pageNum'||k==='access_token') continue;
            const v = pageInfo[k];
            line.push((append?append+'.':'')+k+'=?');
            params.push(v);
        }
        return {
            line: '('+line.join(' AND ')+')',
            params: params
        }
    },
    /**
     *获取order by语句
     * @param {Object}   pageInfo    [  必须包含键值对{orderby:} ]
     * @param {string}   append      [需要添加的表格别名，有时候查询是多表查询，目前此处只支持指定某个表的别名，不支持多个表的别名，没有此参数则不加或者设置为null]
     * @param {string}   charset     [字符集编码，默认是utf8，如果包含中文应设置为gbk，没有则不填]
     * @return 比如 : DB.getOrderBy({orderby:login_id,1}, 'a') => ORDER BY CONVERT(a.login_id USING utf8) ASC
     */
    getOrderBy(pageInfo, append, charset){
        const orderby = (pageInfo&&pageInfo.orderby) || 'create_time';
        if(!orderby) return '';
        const rs = orderby.split(',');
        const col = charset===null?rs[0]:'CONVERT('+((append?append+'.':'') + rs[0])+' USING '+(charset||'utf8')+')';
        return [ '', 'ORDER BY', col, rs[1]==='1'?'ASC':'DESC'].join(' ');
    }
};

const formatPageInfo = function(opts){
    opts = opts || {};
    opts.pageSize = typeof opts.pageSize==='undefined' ? 10 : Number(opts.pageSize);
    opts.pageNum = typeof opts.pageNum==='undefined' ? 1 : Number(opts.pageNum);
    return opts;
};
