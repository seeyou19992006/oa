var TraceRecordschema = new mongoose.Schema({
  userId:String,
  customerId:String,
  traceContent:String,
  traceTime:Date
})

var TraceRecordModel = db.model('traceRecord',TraceRecordschema);

module.exports = TraceRecordModel;
