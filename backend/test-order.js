const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log("Connected to MongoDB");
        const order = new Order({
            orderId: "TEST-ORDER-1",
            userId: new mongoose.Types.ObjectId(),
            items: [{ id: "test", qty: 1 }],
            address: { zip: "12345" },
            payment: { method: "online", razorpay_order_id: "test" },
            status: "pending"
        });
        await order.save();
        console.log("SUCCESS");
        await Order.deleteOne({ orderId: "TEST-ORDER-1" });
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err.message);
        process.exit(1);
    }
});
