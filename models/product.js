import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true }, // Product name
        basePrice: { type: Number, required: true }, // Base price of the product
        //jshippingGST: { type: Number, required: true }, // Shipping and GST
        //packaging: { type: Number, required: true }, // Packaging cost
        quantity: { type: Number, required: true }, // Quantity in stock
        //total: { type: Number, required: true }, // Total cost (basePrice + shippingGST + packaging)
        finalCost: { type: Number, required: true }, // Final price (total * quantity)
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

const Products = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Products;
