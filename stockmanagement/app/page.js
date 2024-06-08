"use client";

import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  // Dummy data for demonstration
  const [newProduct, setNewProduct] = useState({});
  const [stockData, setStockData] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropDown, setDropDown] = useState([
    // {
    //   _id: "657cccf13193097d39e36399",
    //   slug: "fghfh",
    //   quantity: "87",
    //   price: "89809",
    // },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setStockData(rjson.products);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // const handleAddProduct = () => {
  //   // Add the new product to the stock data
  //   setStockData([...stockData, { ...newProduct, id: stockData.length + 1 }]);
  //   // Reset the form fields after adding the product
  //   setNewProduct({ productName: "", quantity: 0, price: 0 });
  // };

  const handleAddProduct = async (e) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        console.log("Successfully added a new product!");
        setAlert("Your Product has been added!");
        setNewProduct({});
      } else {
        console.error("Failed to add new product");
      }
    } catch (error) {
      console.error("Error", error);
    }
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setStockData(rjson.products);
    e.preventDefault();
  };

  const onDropDownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropDown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropDown(rjson.products);
      setLoading(false);
    } else {
      setDropDown([]);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = stockData.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(stockData));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setStockData(newProducts);

    let indexDrop = dropDown.findIndex((item) => item.slug == slug);
    let newDropDown = JSON.parse(JSON.stringify(dropDown));
    if (action == "plus") {
      newDropDown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropDown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropDown(newDropDown);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    console.log(r);
    setLoadingAction(false);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
        <form className="mb-4">
          <div className="flex items-center mb-2">
            <label htmlFor="productName" className="mr-2">
              Product Slug:
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={newProduct?.slug || ""}
              onChange={handleInputChange}
              className="border border-gray-400 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="quantity" className="mr-2">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newProduct?.quantity || ""}
              onChange={handleInputChange}
              className="border border-gray-400 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center mb-2">
            <label htmlFor="price" className="mr-2">
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct?.price || ""}
              onChange={handleInputChange}
              className="border border-gray-400 rounded px-2 py-1"
            />
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="mb-6 container mx-auto">
        <h1 className="text-3xl font-bold mb-3">Search a Product</h1>
        <div className="flex items-center mb-2">
          <input
            type="text"
            id="searchProduct"
            name="searchProduct"
            placeholder="Search Product..."
            className="border border-gray-400 rounded-l px-2 py-1 w-full"
            onChange={onDropDownEdit}
            // onBlur={() => {
            //   setDropDown([]);
            // }}
          />
          <select className="border border-gray-400 rounded-r-md px-4 py-2">
            <option value="productName">Product Name</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center w-20 h-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              id="loading"
            >
              <g data-name="Looding 19">
                <path
                  fill="#414042"
                  d="M29.89 15.81a2.51 2.51 0 1 0-5 .45 9.65 9.65 0 0 1-1.68 6.34 10.24 10.24 0 0 1-5.74 4 10.71 10.71 0 0 1-7.38-.7 11.44 11.44 0 0 1-5.48-5.62A12.07 12.07 0 0 0 9.46 27 12.58 12.58 0 0 0 17.9 29a13.31 13.31 0 0 0 8.18-4 14 14 0 0 0 3.81-8.75v-.08A2.29 2.29 0 0 0 29.89 15.81zM7.11 15.74A9.65 9.65 0 0 1 8.79 9.4a10.24 10.24 0 0 1 5.74-4 10.71 10.71 0 0 1 7.38.7 11.44 11.44 0 0 1 5.48 5.62A12.07 12.07 0 0 0 22.54 5 12.58 12.58 0 0 0 14.1 3 13.31 13.31 0 0 0 5.92 7a14 14 0 0 0-3.81 8.75v.08a2.29 2.29 0 0 0 0 .37 2.51 2.51 0 1 0 5-.45z"
                ></path>
              </g>
            </svg>
          </div>
        )}
        <div className="dropcontainer absolute w-[72vw] bg-blue-100 rounded-md">
          {dropDown.map((item) => {
            return (
              <div
                key={item.slug}
                className="container flex justify-between p-2 my-1 border-b-2"
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("minus", item.slug, item.quantity);
                    }}
                    className="subtract inline-block px-3 py-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md  disabled:bg-blue-200"
                  >
                    -
                  </button>
                  <span className="quantity inline-block w-3 mx-3">
                    {item.quantity}
                  </span>
                  <button
                    disabled={loadingAction}
                    onClick={() => {
                      buttonAction("plus", item.slug, item.quantity);
                    }}
                    className="subtract inline-block px-3 py-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:bg-blue-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>
        <table className="border-collapse border-2 border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-500 p-2">Product Name</th>
              <th className="border border-gray-500 p-2">Quantity</th>
              <th className="border border-gray-500 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item) => (
              <tr key={item.slug}>
                <td className="border border-gray-500 p-2">{item.slug}</td>
                <td className="border border-gray-500 p-2">{item.quantity}</td>
                <td className="border border-gray-500 p-2"> ₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
