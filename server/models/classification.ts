import * as mongoose from 'mongoose';

const classificationSchema = new mongoose.Schema({
  id: String,
  name: String,
  order: Number,
  show: Boolean
});

const Classification = mongoose.model('Classification', classificationSchema);

export default Classification;
