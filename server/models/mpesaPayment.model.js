import mongoose from 'mongoose'
const { Schema } = mongoose;

export const mpesaPaymentSchema = new Schema({
    number: { type:String, required:true },
    transaction_id: { type:String, required:true },
    amount: { type:String, required:true },
},{ timestamps:true });

export default mongoose.model('MpesaPayment', mpesaPaymentSchema)