"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AddProduct() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [basePrice, setBasePrice] = useState("");
    //const [shippingGST, setShippingGST] = useState("");
    //const [packaging, setPackaging] = useState("");
    const [finalCost, setFinalCost] = useState("")
    const [quantity, setQuantity] = useState("");
    const [alert, setAlert] = useState("");
    const [error, setError] = useState("");

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !basePrice || !finalCost || !quantity) {
            setError("All fields are required");
            return;
        }

        // Reset error message
        setError("");

        try {
            // Make sure all number inputs are parsed correctly
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    basePrice: parseFloat(basePrice), // parse as float for price
                    //shippingGST: parseFloat(shippingGST),
                    //packaging: parseFloat(packaging),
                    finalCost: parseFloat(finalCost),
                    quantity: parseInt(quantity), // parse as integer for quantity
                }),
            });

            if (res.ok) {
                setAlert("Product added successfully");
                router.push('/');
            } else {
                throw new Error("Failed to create a new product");
            }
        } catch (error) {
            console.error(error);
            setError("There was an error adding the product. Please try again.");
        }
    };

    return (
        <>
            <div className="container mx-auto p-4">
                {/* Display success or error messages */}
                {alert && <div className="text-green-700 text-center mb-4">{alert}</div>}
                {error && <div className="text-red-700 text-center mb-4">{error}</div>}
                
                <h1 className="text-2xl font-bold mb-4">Add a Product</h1>
                <form onSubmit={handleAddProduct} className="mb-6">
                    <div className="mb-4">
                        <label className="block text-gray-700">Product Name:</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            value={name}
                            className="w-full p-2 border rounded"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Base Price:</label>
                        <input
                            onChange={(e) => setBasePrice(e.target.value)}
                            type="number"
                            name="basePrice"
                            value={basePrice}
                            className="w-full p-2 border rounded"
                            placeholder="Enter base price"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Final Cost:</label>
                        <input
                            onChange={(e) => setFinalCost(e.target.value)}
                            type="number"
                            name="finalCost"
                            value={finalCost}
                            className="w-full p-2 border rounded"
                            placeholder="Enter final cost"
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-gray-700">Packaging:</label>
                        <input
                            onChange={(e) => setPackaging(e.target.value)}
                            type="number"
                            name="packaging"
                            value={packaging}
                            className="w-full p-2 border rounded"
                            placeholder="Enter packaging cost"
                        />
                    </div> */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Quantity:</label>
                        <input
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
                            name="quantity"
                            value={quantity}
                            className="w-full p-2 border rounded"
                            placeholder="Enter quantity"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </>
    );
}
