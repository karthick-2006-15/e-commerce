const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:           { type: String, required: true, unique: true },
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 👈 links to customer
  guestInfo:         { type: Object }, // 👈 stores email, phone, name if no userId
  items:             { type: Array,  required: true },
  address:           { type: Object, required: true },
  payment:           { type: Object, required: true },
  deliverySlot:      { type: String },
  subtotal:          { type: Number },
  deliveryCharge:    { type: Number },
  total:             { type: Number },
  shiprocketShipmentId: { type: String, default: null },
awbCode:              { type: String, default: null },
courierName:          { type: String, default: null },
  status:            { type: String, default: 'confirmed',
                       enum: ['pending','confirmed','preparing','packed','out_for_delivery','delivered','cancelled'] },
  estimatedDelivery: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);