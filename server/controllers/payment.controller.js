// require("dotenv").config();
import axios from "axios";
import MpesaPayment from "../models/mpesaPayment.model.js";

//stk push
export const STKPush = 
  async (req, res, next) => {
    try {
      //generate M-pesa access token
      const consumer_key = process.env.MPESA_CONSUMER_KEY;
      const consumer_secret = process.env.MPESA_CONSUMER_SECRET;

      const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
        "base64"
      );
      await axios
        .get(
          "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          {
            headers: { Authorization: `Basic ${auth}` },
          }
        )
        .then(async (response) => {
          const token = response.data.access_token;

          //stk push
          const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
          const phone = req.body.phone.substring(1);
          const amount = req.body.amount;

          //create timestamp for mpesa stk push
          const date = new Date();
          const timestamp =
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

          const shortCode = process.env.MPESA_PAYBILL;
          const passkey = process.env.MPESA_PASSKEY;
            // generate password
          const password = Buffer.from(
            shortCode + passkey + timestamp
          ).toString("base64");

          await axios
            .post(
              url,
              {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: 1, //amount set to 1 shilling for code testing
                PartyA: `254${phone}`,
                PartyB: shortCode,
                PhoneNumber: `254${phone}`,
                CallBackURL: "https://2262-102-219-208-254.ngrok-free.app/stk/callback",
                AccountReference: `GetHired 254${phone}`,
                TransactionDesc: "Test",
                // https://mydomain.com/path
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(async (data) => {
              const payment_info = data.data;
              const CheckoutRequestID = data.data.CheckoutRequestID;
              res.status(200).json({
                message: "STK Push request",
                payment_info
            })
            //   const PaymentData = {
            //     user: user?._id,
            //     amount: 250,
            //     payment_info: payment_info,
            //     CheckoutRequestID: CheckoutRequestID,
            //   };

              //delete any existing payment records which have not been successful
            //   await PaymentModel.deleteMany({ user: user?._id });

              //create a payment record
            //   const payment = await PaymentModel.create(PaymentData);
            //   res.status(200).json({
            //     data: data.data,
            //     message: "Complete your payment by entering the Mpesa pin",
            //     CheckoutRequestID: CheckoutRequestID,
            //   });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                message:'Error making STK push',
                err
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            message:'Error getting mpesa token',
            err
          });
        });
    } catch (error) {
      return res.status(401).json({
        message:'Failed to get mpesa token',
        error
      });
    }
  };

//callback api for stkpush
export const MpesaCallBack = async (req, res, next) => {
    const callbackData = req.body.Body.stkCallback
    try {
      console.log(callbackData);
      if(!callbackData.CallbackMetadata){
        console.log(callbackData)
        res.json('ok')
      }
    //   const payment_info = callbackData.CallbackMetadata;
      const payment_status = callbackData.ResultDesc;
      const CheckoutRequestID = callbackData.CheckoutRequestID;
      const resultCode = callbackData.ResultCode;

     
      if (resultCode === 0) {
        payment.number = callbackData.CallbackMetadata.Item[3].Value;
        payment.transaction_id = callbackData.CallbackMetadata.Item[1].Value;
        payment.amount = callbackData.CallbackMetadata.Item[0].Value;
        payment.save()
        // const user = await UserModel.findById(req.user?._id);
        // if (!user) {
        //     return res.status(400).send("No user with the specified ID. Please login")
         
        // }

        const payment = await MpesaPayment.findOne({
          CheckoutRequestID: CheckoutRequestID,
        });

        // update payment info.
        if (payment) {
            payment.number = callbackData.CallbackMetadata.Item[3].Value;
            payment.transaction_id = callbackData.CallbackMetadata.Item[1].Value;
            payment.amount = callbackData.CallbackMetadata.Item[0].Value;
          await payment.save();
        }
   
      } else if (resultCode !== 0) {
        res.status(200).json({
            message:'Payment has not gone through',
            payment_status
        });
      }
    } catch (error) {
      return res.status(400).send("An error occured.");
    }
  };

//stk query api
export const CheckPaymentStatus = 
  async (req, res) => {
    try {
      //generate M-pesa access token
      const consumer_key = process.env.MPESA_CONSUMER_KEY;
      const consumer_secret = process.env.MPESA_CONSUMER_SECRET;

      const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
        "base64"
      );
      await axios
        .get(
          "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          {
            headers: { Authorization: `Basic ${auth}` },
          }
        )
        .then(async (response) => {
          const token = response.data.access_token;

          //stkpush query
          const url =
            "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";

          const date = new Date();
          const timestamp =
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

          const shortCode = process.env.MPESA_PAYBILL;
          const passkey = process.env.MPESA_PASSKEY;

          const password = Buffer.from(
            shortCode + passkey + timestamp
          ).toString("base64");
          const CheckoutRequestID = req.body.CheckoutRequestID;
          await axios
            .post(
              url,
              {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: CheckoutRequestID,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(async (response) => {
              console.log(response.data,'response data from checkpaymentstatus');
              //for successful payment status
              if (response.data.ResultCode === "0") {
                const payment = await MpesaPayment.findOne({
                  CheckoutRequestID: CheckoutRequestID,
                });
                //update payment info.
                if (payment) {
                    payment.number = callbackData.CallbackMetadata.Item[3].Value;
                    payment.transaction_id = callbackData.CallbackMetadata.Item[1].Value;
                    payment.amount = callbackData.CallbackMetadata.Item[0].Value;
                  await payment.save();
                }            
            }
            res.status(200).json(response.data)
            })
            .catch((err) => {
              console.log(err, 'error 1');
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          console.log(err,'error 2');
          res.status(400).json(err.message);
        });
    } catch (error) {
        console.log(error, 'error 3')
      return res.status(400).send('Failed');
    }
  };

// cron.schedule("0 * * * *", async () => {
//   CheckPaymentStatus();
// });
