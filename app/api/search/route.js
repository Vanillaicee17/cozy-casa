import { NextResponse } from 'next/server';
// import connectMongoDB from "@/libs/mongodb"; // Ensure this path is correct
import {MongoClient} from "mongodb";

// Define the GET handler for your API route
export async function GET(request) {
    // Connect to MongoDB
    // const db = await connectMongoDB(); // Ensure `connectMongoDB` returns the database instance

    // Extract the query1 parameter from the request URL
    const query1 = request.nextUrl.searchParams.get("query") || ''; // Use .get() to access query1 parameter
    const uri = "mongodb+srv://cozycasa:M203ddoyb0e51Ln7@cluster0.9es3j.mongodb.net/";
    const client = new MongoClient(uri); 
    try {
      const database = client.db('cozycasa_db');
      const inventory =  database.collection('products');

      const products = await inventory.aggregate([{
        $match:{
          $or:[
            {name:{$regex:query1, $options:'i'}},
          ]
        }
      }]).toArray()  
      return NextResponse.json({ products });
    } finally{
      await client.close();
    }
}
