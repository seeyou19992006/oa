var CompanySchema = new mongoose.Schema({
  name:String,
  id:Number,
  parentId:Number,
  path:String,
  remark:String,
})

var CompanyModel = db.model('company',CompanySchema);

module.exports = CompanyModel;

IdSchema = new mongoose.Schema({
  name:String,
  id:Number,
})
var IdModel = db.model('id',IdSchema);


CompanyModel.prototype.saveWithNewId = function(){
  var that = this;
  IdModel.findOneAndUpdate({name:"company"},{'$inc':{'id':1}},function(err,doc){
    that.id = doc.id;
    if(that.parentId){
      CompanyModel.findOne({'id':that.parentId-0},function(err,doc){
        if(err){

        }else{
          that.path = doc.path+'/'+that.id;
          that.save();
        }
      });
    }else{
      that.path = '/' + that.id;
      that.save();
    }
  })
}
