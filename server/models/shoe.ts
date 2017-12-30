import * as mongoose from 'mongoose';
import Classification from './classification'

const ImageUrlSchema = new mongoose.Schema({
  urlSmall: String,
  urlMedium: String,
  urlLarge: String,
  urlXL: String,
});

const SizeAmountSchema = new mongoose.Schema({
  size: String,
  amount: Number
});

const ImageSchema = new mongoose.Schema({
  color: String,
  sizes: [ SizeAmountSchema ],
  images: [ ImageUrlSchema ]
});

const DiscountSchema = new mongoose.Schema({
  isPercentage: Boolean,
  percentage: Number,
  newAmount: Number
});



const shoeSchema = new mongoose.Schema({
  id: { type: [String], index: true },
  active: Boolean,
  company: String,
  companyId: String,
  name: String,
  price: Number,
  discount: DiscountSchema,
  gender: [String],
  classificationCache: String,
  classification: {
    type: mongoose.Schema.ObjectId,
    ref: 'classificationSchema'
  },
  //TODO: Check if need to remove in prod?!
  searchWords: { type: [String], index: true },
  information: String,
  imagesGroup: [ ImageSchema ],
  stock: Number,
  updated: { type: Date, default: Date.now },
  inserted: { type: Date, default: Date.now },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

export default Shoe;
