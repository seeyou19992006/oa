var TraceRecordschema = new mongoose.Schema({
  companyId:String,
  userId:String,
  customerId:String,
  traceContent:String,
  traceTime:String,
  traceType:Number,
})

var TraceRecordModel = db.model('traceRecord',TraceRecordschema);

module.exports = TraceRecordModel;
