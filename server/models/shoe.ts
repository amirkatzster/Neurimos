import * as mongoose from 'mongoose';

const shoeSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  age: Number
});

const Shoe = mongoose.model('Shoe', shoeSchema);

export default Shoe;
