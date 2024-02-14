import mongoose from 'mongoose';
const { Schema, models } = mongoose;

const googleUserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    }
},{timestamps: true});

const GoogleUser = models.GoogleUser || mongoose.model('GoogleUser', googleUserSchema)

export default GoogleUser;

// export default mongoose.model('GoogleUser', googleUserSchema)