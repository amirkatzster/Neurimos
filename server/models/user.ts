import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  role: { type: String, default: 'user' },
  local          : {
    email        : { type: String, unique: true, lowercase: true, trim: true } ,
    password     : String,
  },
  facebook       : {
    id           : String,
    token        : String,
    name         : String,
    email        : String
  },
  google         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
});

// Before saving the user, hash the password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    if (ret.local) {
      delete ret.local.password;
    }
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
