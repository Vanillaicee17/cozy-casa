"use client";

import { useState, useEffect, useRef } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch products on page load
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/products`, {
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

  // Fetch dropdown results based on user query
  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      setLoading(true);
      setDropdown([]);
      try {
        const res = await fetch(`${apiUrl}/api/search?query=${value}`);

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
      setIsDropdownVisible(false);
    }
  };

  // Close dropdown if clicked outside
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle product quantity change for both dropdown and table
  const handleProductAction = async (
    action,
    name,
    initialQuantity,
    isDropdown = false
  ) => {
    const updateProductList = (list, name, action, quantity) => {
      let index = list.findIndex((item) => item.name === name);
      if (index !== -1) {
        let newList = [...list];
        newList[index].quantity =
          action === "plus" ? quantity + 1 : quantity - 1;
        return newList;
      }
      return list;
    };

    setProducts((prev) =>
      updateProductList(prev, name, action, initialQuantity)
    );
    if (isDropdown)
      setDropdown((prev) =>
        updateProductList(prev, name, action, initialQuantity)
      );

    setLoadingAction(true);
    try {
      const res = await fetch(`${apiUrl}/api/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          name,
          initialQuantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to perform action");
      }

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
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          onChange={onDropdownEdit}
          value={query}
          onFocus={() => setIsDropdownVisible(true)}
          type="text"
          placeholder="Search by product name"
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <select className="border border-gray-300 rounded-md bg-white h-10 px-4 py-2">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="20"
            height="20"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="#000"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}

      {isDropdownVisible && dropdown.length === 0 && query && (
        <div className="text-center mt-3">
          <p>No results found for "{query}"</p>
        </div>
      )}

      {isDropdownVisible && dropdown.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute border bg-white rounded-b-xl border-indigo-500/50 border-x-2 border-b-2 shadow-md mt-1"
          style={{ width: inputRef.current?.offsetWidth || "auto" }}
        >
          {dropdown.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-3 hover:bg-gray-100 cursor-pointer p-3 items-center border-t-2 border-indigo-500/50"
            >
              <div className="grid justify-items-start">{item.name}</div>
              <div className="grid justify-items-center">{item.finalCost}</div>
              <div className="grid justify-items-end">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleProductAction(
                        "minus",
                        item.name,
                        item.quantity,
                        true
                      )
                    }
                    disabled={loadingAction || item.quantity <= 0}
                    className="subtract cursor-pointer px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleProductAction(
                        "plus",
                        item.name,
                        item.quantity,
                        true
                      )
                    }
                    disabled={loadingAction}
                    className="add cursor-pointer px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-2xl mb-4 mt-10">Current Stock</h1>
      {products.length > 0 ? (
        <table className="w-full table-auto border-collapse text-base mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center">Product Name</th>
              <th className="border p-2 text-center">Base Price</th>
              <th className="border p-2 text-center">Quantity</th>
              <th className="border p-2 text-center">Final Cost</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="bg-white">
                <td className="border px-2 py-1 text-center">{p.name}</td>
                <td className="border px-2 py-1 text-center">{p.basePrice}</td>
                <td className="border px-2 py-1 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() =>
                        handleProductAction("minus", p.name, p.quantity)
                      }
                      disabled={loadingAction || p.quantity <= 0}
                      className="subtract cursor-pointer px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                    >
                      -
                    </button>
                    <span className="mx-3">{p.quantity}</span>
                    <button
                      onClick={() =>
                        handleProductAction("plus", p.name, p.quantity)
                      }
                      disabled={loadingAction}
                      className="add cursor-pointer px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border px-2 py-1 text-center">{p.finalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products in stock.</p>
      )}
    </div>
  );
}
