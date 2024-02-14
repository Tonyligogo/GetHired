import mongoose from 'mongoose'
const { Schema } = mongoose;

const cvSchema = new Schema({
    owner: {
      type: Schema.Types.ObjectId,
      ref:'User',
      required: true,
    },
    education: String,
    workExperience: String,
    skills: [String],
  }, { timestamps: true });
  

export default mongoose.model('CV', cvSchema);




