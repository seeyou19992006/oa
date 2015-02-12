var UserSchema = new mongoose.Schema({
  userId:String,
  password:String,
  userName:String,
  userType:String,
  companyId:String,
  effective:Boolean,
  companyPath:String
})

var UserModel = db.model('user',UserSchema);

module.exports = UserModel;
