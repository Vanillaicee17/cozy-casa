import { NextResponse } from 'next/server';
import connectMongoDB from "@/libs/mongodb"; // Adjust the path if needed
import Products from '@/models/product'; // Adjust the path if needed

export async function POST(request) {
    
    try {
        let { action, name, initialQuantity} = await request.json()
        // Connect to MongoDB
        await connectMongoDB();


        const filter = { name: name };

        let newQuantity = action == "plus" ? initialQuantity + 1 : initialQuantity - 1;

    
        // Specify the update to set a value for the plot field
    
        const updateDoc = {
    
          $set: {
            quantity: newQuantity
          },
    
        };
    
        // Update the first document that matches the filter
    
        const result = await Products.updateOne(filter, updateDoc,);
    
        
    
        // Print the number of matching and modified documents
    
        console.log(
    
          `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    
        );


        return NextResponse.json({ message: "Quantity Updated" }, { status: 201 });
    } catch (error) {
        console.error("Error Updating :", error);
        return NextResponse.json({ message: "Failed to update Quantity" }, { status: 500 });
    }
}