exports.processPayment = catchAsyncErrors(async(req, res, next) => {
    try {
        const frontendUrl = req.body.frontendUrl || process.env.FRONTEND_URL;

        const line_items = req.body.items.map((item) => {
            const food = (item && item.foodItem) || {};
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: food.name || "Food Item",
                        // ⚠️ images removed — broken Bing/Brave URLs break Stripe checkout
                    },
                    unit_amount: Math.round(Number(food.price || 0) * 100),
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            customer_email: req.user.email,
            phone_number_collection: { enabled: true },
            line_items: line_items,
            mode: "payment",
            shipping_address_collection: { allowed_countries: ["US", "IN"] },
            shipping_options: [{
                shipping_rate_data: {
                    display_name: "Delivery Charges",
                    type: "fixed_amount",
                    fixed_amount: { amount: 5500, currency: "inr" },
                    delivery_estimate: {
                        minimum: { unit: "hour", value: 1 },
                        maximum: { unit: "hour", value: 3 },
                    },
                },
            }, ],
            success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/cart`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.log("⚠️ STRIPE ERROR:", err.message); // shows the real reason in logs
        return next(err);
    }
});