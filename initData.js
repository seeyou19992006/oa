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
db.users.add(user);
db.ids.add(id);