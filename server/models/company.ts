import * as mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  id: String,
  name: String,
  information: String,
  image: String
});

const Company = mongoose.model('Company', companySchema);

export default Company;
