use oa;
var user = {
    "userId": "admin",
    "password": "abc123",
    "companyPath": "/1",
    "effective": true,
    "role": 0,
    "companyId": 1,
    "userName": "超级管理员"
}

var id = {
    "id": 1,
    "name": "company"
}
var company = {
  "id":1,
  "name":'万和数据',
  "path":'/1'
}
db.companies.insert(company);
db.users.insert(user);
db.ids.insert(id);
