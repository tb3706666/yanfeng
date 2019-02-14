===========各应用发布端口说明，对应每个工程configs/config.prod.js文件里的port=======
1.maximo-node:7001      访问路径 /maximo/...
2.change-node:7002      访问路径 /change/...
3.bosfile-node:7003     访问路径 /bosfile/...
4.cicenter-node:7004    访问路径 /cicenter/...
5.daka-node:7005        访问路径 /daka/...
6.eods-p:7006           访问路径 /eods-p/...
7.gongzichaxun:7007     访问路径 /gongzichaxun/...
8.information-node:7008 访问路径 /information/...
9.mobile-node:7009      访问路径 /mobile-node/...
10.oa-node:7010         访问路径 /oa-node/...
11.pdasystem-node:7011  访问路径 /pdasystem/...
12.ydpd-node:7012       访问路径 /yidongpandian/...

===========各应用对应要求能访问的业务系统地址=======
1. bosfile-node(文件更改流程)，oa-node(移动办公)，eods-p（文档查询），information-node(个人信息更新)
--workflow测试环境http://10.178.188.241:8080/ekp ，正式环境http://10.178.185.127:8080/ekp
--hris测试环境http://10.118.8.13/yfjc_newad_test1 ，正式环境https://ae-nhrbs.adient.com/YFAS_NEWAD
--hrnew测试环境http://10.118.8.13 ，正式环境http://10.118.8.20

2. gongzichaxun（工资查询）
--数据库mssql ip:10.178.185.64 port:1433 dbname:YFJC_HRIS   

3. maximo-node
--maximo系统webservice接口测试环境http://10.178.188.111:9080  正式环境http://10.178.191.38:9080

4. change-node（备料更换系统），daka-node(打卡记录)
--数据库mssql ip:10.178.191.23  dbname:MOBILE

5. cicenter-node(CiCenter系统)
--CiCenter系统测试环境http://a878sm24.autoexpr.com:9100/CICenter 正式环境http://10.178.185.105:9000/CICenter

6. mobile-node（移动小i）
--移动小I测试环境http://10.178.188.105/ServiceDesk.WebAccess  正式环境https://itsm.yanfengadient.com/ServiceDesk.WebAccess2

7. pdasystem-node（电子巡检）
--数据库mssql 测试环境ip:10.178.188.103 port:51433 dbname:FormPDASystem   正式环境ip:10.100.143.38 port:1433 dbname:FormPDASystem

8.ydpd-node(移动盘点)
--移动盘点webservice接口测试环境http://10.178.188.154/ALMServer/InventoryService.asmx    正式环境http://10.178.185.247/ALMServer/InventoryService.asmx

9. iexpress(Iexpress系统)
--Iexpress系统测试环境http://a878sm24.autoexpr.com:5050   正式环境http://10.178.185.105:8080
