import * as mongoose from 'mongoose';

const classificationSchema = new mongoose.Schema({
  name: String,
  order: Number,
  show: Boolean
});

const Classification = mongoose.model('Classification', classificationSchema);

export default Classification;
