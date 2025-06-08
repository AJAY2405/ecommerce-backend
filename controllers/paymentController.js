import mongoose from "mongoose";
import crypto from "crypto";

import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
// import orderModel from "../models/orderModel";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const capturePayment = async (req, res) => {
  //get courseId and UserID

  // console.log("body", req.body);
  const cart = req.body;
  const userId = req.user._id;

  console.log("instance = ", instance);

  //validation
  //valid courseIDP
  try {
    console.log("cart= ", cart);
    console.log("user id= ", userId);

    if (cart.length === 0) {
      return res.json({
        success: false,
        message: "Please provide valid course IDs",
      });
    }

    let totalAmount = 0;

    for (const item of cart) {
      totalAmount += item.price * item.quantity || 0;
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };
    console.log("options = ", options);
    try {
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("payment", paymentResponse);
      //return response
      return res.status(200).json({
        success: true,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify the signature
export const verifySignature = async (req, res) => {
  //get the payment details
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const { orders } = req.body;
  const userId = req.user._id;

  console.log("verify sign = ", req.body);

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment details are incomplete",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const productIds = orders.map((item) => item._id);

  try {
    //verify the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (generatedSignature === razorpay_signature) {
      console.log("Signature is verified");
      const paymentDetails = {
        buyer: userId,
        products: productIds,
        paymentStatus: "Paid",
        payment: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
      };

      console.log("paymentDetails = ", paymentDetails);
      const order = await new orderModel(paymentDetails).save();

      console.log("new order = ", order);
      return res.status(200).json({
        success: true,
        message: "Payment successful order created",
        order: order,
      });
    }else {
      const paymentDetails = {
        buyer: userId,
        products: productIds,
        paymentStatus: "Failed",
        payment: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
      };

      console.log("paymentDetails = ", paymentDetails);
      const order = await new orderModel(paymentDetails).save();

      console.log("Signature verification failed");
      return res.status(400).json({
        success: false,
        message: "Signature verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
