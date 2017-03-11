var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var CounterSchema = Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

var counter = mongoose.model('counter', CounterSchema);

var urlSchema = new Schema({
  _id: {
    type: Number,
    index: true
  },
  longUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  author: {
      type: String,
      required: true
  },
  amountRedirections: {
      type: Number,
      default: 0,
      required: true
  }
});

urlSchema.pre('save', function(next){
  var doc = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1}}, {new: true, upsert: true})
    .then(function (counter) {
      doc._id = counter.seq;
      next();
    })
    .catch(function (err) {
      next(error);
    });
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;