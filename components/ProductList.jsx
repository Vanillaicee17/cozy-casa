"use client";

import { useState, useEffect, useRef } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [dropdown, setDropdown] = useState([]); 
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
    const [loadingAction, setLoadingAction] = useState(false);
    const inputRef = useRef(null); 
    const dropdownRef = useRef(null); 

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                    cache: "no-store", 
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await res.json();
                setProducts(data); 
            } catch (error) {
                console.log("Error loading products: ", error);
                setProducts([]); 
            } finally {
                setLoading(false); 
            }
        };

        getProducts(); 
    }, []); 

    const onDropdownEdit = async (e) => {
        let value = e.target.value;
        setQuery(value);
        
        if (value.length > 0) {  // Fix comparison for string length
            setLoading(true);
            setDropdown([]); 
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${value}`);  // Use 'value' instead of 'query'
                
                if (!res.ok) {
                    throw new Error("Failed to fetch search results");
                }
    
                const rjson = await res.json();
                setDropdown(rjson.products || []); 
                setIsDropdownVisible(true); 
            } catch (error) {
                console.log("Error fetching dropdown data: ", error);
                setDropdown([]); 
            } finally {
                setLoading(false);
            }
        } else {
            setIsDropdownVisible(false);  // Hide the dropdown if the query is too short
        }
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current && 
            !dropdownRef.current.contains(event.target) && 
            !inputRef.current.contains(event.target)
        ) {
            setIsDropdownVisible(false); 
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, []);

    const buttonAction = async (action, name, initialQuantity) => {
        let index = products.findIndex((item)=> item.name === name );
        let newProducts = JSON.parse(JSON.stringify(products));
        
        if (action === "plus") {
            newProducts[index].quantity = initialQuantity + 1;
        } else {
            newProducts[index].quantity = initialQuantity - 1;
        }
        setProducts(newProducts);
        
        let indexdrop = dropdown.findIndex((item) => item.name === name);
        let newDropdown = JSON.parse(JSON.stringify(dropdown));
        
        if (action === "plus") {
            newDropdown[indexdrop].quantity = initialQuantity + 1;
        } else {
            newDropdown[indexdrop].quantity = initialQuantity - 1;
        }
        setDropdown(newDropdown);

        setLoadingAction(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/action`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    name,
                    initialQuantity,
                }),
            });

            const result = await res.json();
            console.log(result);
        } catch (error) {
            console.log("Error performing action: ", error);
        } finally {
            setLoadingAction(false);
        }
    };

    const tablebuttonAction = async (action, name, initialQuantity) => {
        let index = products.findIndex((item)=> item.name === name );
        let newProducts = JSON.parse(JSON.stringify(products));
        
        if (action === "plus") {
            newProducts[index].quantity = initialQuantity + 1;
        } else {
            newProducts[index].quantity = initialQuantity - 1;
        }
        setProducts(newProducts);

        setLoadingAction(true);
        try {
            const res = await fetch(`${apiUrl}/api/action`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    name,
                    initialQuantity,
                }),
            });

            const result = await res.json();
            console.log(result);
        } catch (error) {
            console.log("Error performing action: ", error);
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Search Products</h1>
            <div className='flex items-center gap-4'>
                <input
                    ref={inputRef} 
                    onChange={onDropdownEdit}
                    value={query}
                    onFocus={() => setIsDropdownVisible(true)} 
                    type="text"
                    placeholder="Search by product name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />

                <select className='border border-gray-300 rounded-md bg-white h-10 px-4 py-2'>
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="popular">Popular</option>
                </select>
            </div>

            {loading && (
                <div className="flex justify-center items-center my-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20" height="20">
                        <circle cx="25" cy="25" r="20" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 25 25"
                                to="360 25 25"
                                dur="1s"
                                repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>
            )}
            {!loading && dropdown.length === 0 && query && (
                <div className="text-center mt-3">
                    <p>No results found for "{query}"</p>
                </div>
            )}
            {isDropdownVisible && (
                <div
                    ref={dropdownRef}
                    className="dropcontainer absolute border-1 bg-white rounded-md"
                    style={{ width: inputRef.current?.offsetWidth || 'auto' }} 
                >
                    {dropdown.map(item => (
                        <div key={item._id} className="container flex flex-col justify-between my-3"> 
  <span className="px-4 py-2">{item.name}</span> 
  <span className="px-4 py-2">{item.basePrice}</span> 
  <div className="mx-3 flex items-center justify-center">
    <button onClick={() => buttonAction("minus", item.name, item.quantity)} disabled={loadingAction} className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">-</button> 
    <span className="quantity inline-block w-3 mx-3">{item.quantity}</span> 
    <button onClick={() => buttonAction("plus", item.name, item.quantity)} disabled={loadingAction} className="add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">+</button> 
  </div> 
</div>

            )}

            <h1 className="text-2xl mb-4 my-10">Current Stock</h1>
            {products.length > 0 ? (
                <table className="w-full table-auto border-collapse rounded text-base mt-4 md:mt-0">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-center">Product Name</th>
                            <th className="border p-2 text-center">Base Price</th>
                            <th className="border p-2 text-center">Quantity</th>
                            <th className="border p-2 text-center">Final Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => {
                            const total = p.basePrice;
                            return (
                                <tr key={p._id} className="bg-white">
                                    <td className="border px-2 py-1 text-center">{p.name}</td>
                                    <td className="border px-2 py-1 text-center">{total}</td>
<td className="border w-30 px-2 py-1 text-center">
    <div className="flex items-center justify-center">
        <button 
            onClick={() => tablebuttonAction("minus", p.name, p.quantity)} 
            disabled={loadingAction} 
            className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
        >
            -
        </button>
        <span className="inline-block w-3 mx-3 text-center">{p.quantity}</span>
        <button 
            onClick={() => tablebuttonAction("plus", p.name, p.quantity)} 
            disabled={loadingAction} 
            className="add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
        >
            +
        </button>
    </div>
</td>

                                    <td className="border px-2 py-1 text-center">{p.finalCost}</td>
                                </tr>
                            );
                        })}
                    </tbody>
               

                </table>
            ) : (
                <p>No products in stock.</p>
            )}
        </div>
    );
}
