

import React, { useState } from "react";
import ListCart from "./ListCart";
import ListProduct from "./ListProduct";

class MyCart {
  price: number;
  name: string;
  quantity: number;
  constructor(name: string, price: number, quantity: number) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

class Product {
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  isDisabled: boolean;
  constructor(name: string, description: string, image: string, price: number, quantity: number) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.quantity = quantity;
    this.isDisabled = quantity === 0;
  }
}

export default function Form() {
  const [products, setProducts] = useState([
    new Product("Product 1", "Description 1", "image1.jpg", 10, 5),
    new Product("Product 2", "Description 2", "image2.jpg", 15, 3),
  ]);

  const [myCarts, setMyCarts] = useState(() => {
    const storedCarts = localStorage.getItem("myCarts");
    return storedCarts ? JSON.parse(storedCarts) : [];
  });

  const handleAddToCart = (product: { name: any; price: any; }, _quantity: any, index: string | number) => {
   
  const existingCartItem = myCarts.find((item: { name: any; }) => item.name === product.name);
  if (existingCartItem) {
     const updatedCarts = myCarts.map((item: { name: any; quantity: number; }) =>
      item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setMyCarts(updatedCarts);
    localStorage.setItem("myCarts", JSON.stringify(updatedCarts));
  } else {
    const updatedCarts = [...myCarts, new MyCart(product.name, product.price, 1)];
    setMyCarts(updatedCarts);
    localStorage.setItem("myCarts", JSON.stringify(updatedCarts));
  }
    const updatedProduct = { ...product };
    updatedProduct.quantity -= 1;
    updatedProduct.isDisabled = updatedProduct.quantity === 0;
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = updatedProduct;
      return updatedProducts;
    });
  };

  return (
    <>
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
        </div>

        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h1 className="panel-title">List Products</h1>
              </div>
              <ListProduct handleAddToCart={handleAddToCart} products={products} />
            </div>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div className="panel panel-danger">
              <div className="panel-heading">
                <h1 className="panel-title">Your Cart</h1>
              </div>
              <ListCart myCarts={myCarts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
