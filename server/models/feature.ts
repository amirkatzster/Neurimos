import * as mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  id: String,
  name: String
});

const Feature = mongoose.model('Feature', featureSchema);

export default Feature;
