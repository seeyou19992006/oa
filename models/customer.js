var CustomerSchema = new mongoose.Schema({
  customerName:String,
  money:Number,
  customerType:String,
  sex:String,
  birthday:String,
  provinceName:String,
  cityName:String,
  cellPhone:String,
  phone:String,
  qqNumber:String,
  nickname:String,
  idCard:String,
  address:String,
  remark:String,
  userId:String,
  userPath:String,
})

var CustomerModel = db.model('customer',CustomerSchema);

module.exports = CustomerModel;