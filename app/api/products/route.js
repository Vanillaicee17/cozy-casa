import { NextResponse } from 'next/server';
import connectMongoDB from "@/libs/mongodb"; // Adjust the path if needed
import Products from '@/models/product'; // Make sure to import your Mongoose product model

export async function POST(request) {
    try {
        // Parse the incoming request body
        const { name, basePrice, shippingGST, packaging, quantity } = await request.json();

        // Validation to ensure required fields are present
        if (!name || !basePrice || !shippingGST || !packaging || !quantity) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Ensure quantity is stored as a number
        const parsedQuantity = parseInt(quantity);

        // Ensure the values are valid numbers
        if (isNaN(basePrice) || isNaN(shippingGST) || isNaN(packaging) || isNaN(parsedQuantity)) {
            return NextResponse.json({ message: "Price, GST, Packaging, and Quantity must be valid numbers" }, { status: 400 });
        }

        // Connect to MongoDB
        await connectMongoDB();

        // Create the product in MongoDB
        const newProduct = await Products.create({
            name,
            basePrice: parseFloat(basePrice),
            shippingGST: parseFloat(shippingGST),
            packaging: parseFloat(packaging),
            quantity: parsedQuantity,
        });

        return NextResponse.json({ message: "Product Created", product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
    }
}

export async function GET(){
    await connectMongoDB();
    const products = await Products.find();
    return NextResponse.json(products);
}