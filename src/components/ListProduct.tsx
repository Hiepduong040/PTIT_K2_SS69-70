

import React, { useEffect, useState } from "react";
import Swal from "sweetalert";

class Product {
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  isDisabled: boolean;

  constructor(
    name: string,
    description: string,
    image: string,
    price: number,
    quantity: number
  ) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.quantity = quantity;
    this.isDisabled = quantity === 0;
  }
}
class MyCart {
  name: string;
  price: number;
  quantity: number;

  constructor(name: string, price: number, quantity: number) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}
type HandleAddToCartType = (product: Product, quantity: number, index: number) => void;

export default function ListProduct({ handleAddToCart }: { handleAddToCart: HandleAddToCartType }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts([
        // thầy đẩy dữ liệu lên local chỉ cần xóa đoạn này là nó chạy ạ:
        // const storedProducts = localStorage.getItem("products");
        // if (storedProducts) {
        //   setProducts(JSON.parse(storedProducts));
        // } else {}
        new Product(
          "Pizza",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!",
          "images/pizza.jpg",
          30,
          100
        ),
        new Product(
          "Hamburger",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!",
          "./images/Hamburger.jpg",
          15,
          400
        ),
        new Product(
          "Bread",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!",
          "images/bread.jpg",
          20,
          500
        ),
        new Product(
          "Cake",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!",
          "./images/Cake.jpg",
          10,
          500
        ),
      ]);
    }
  }, []);
  const [myCarts, setMyCarts] = useState<MyCart[]>([]);
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (myCarts.length > 0) {
      Swal("Add to cart successfully", "", "success");
    }
  }, [myCarts]);

  const updateProductQuantity = (updatedProducts: React.SetStateAction<Product[]>) => {
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = newQuantity;
    updatedProducts[index].isDisabled = newQuantity === 0;
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };
  

  const handleAddToCartClick = (product: Product, quantity: number, index: number) => {
    const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    const parsedProducts = JSON.parse(storedProducts);
    parsedProducts[index].quantity -= quantity;
    localStorage.setItem("products", JSON.stringify(parsedProducts));
    updateProductQuantity(parsedProducts); // Cập nhật lại mảng products
  }
  
    const updatedProduct = { ...product };
    updatedProduct.quantity -= quantity;
    updatedProduct.isDisabled = updatedProduct.quantity === 0;
    handleQuantityChange(index, updatedProduct.quantity);
  
    const updatedCarts = [...myCarts];
    const existingCartItem = updatedCarts.find((cartItem) => cartItem.name === product.name);
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      updatedCarts.push(new MyCart(product.name, product.price, quantity));
    }
    setMyCarts(updatedCarts);
    handleAddToCart(product, quantity, index);
    Swal("Add to cart successfully", "", "success");
  };


  return (
    <div className="panel-body" id="list-product">
      {products.map((product, index) => (
        <div key={index}>
          <div className="media product">
            <div className="media-left">
              <a href="#">
                <img className="media-object" src={product.image} alt={product.name} />
              </a>
            </div>
            <div className="media-body">
              <h4 className="media-heading">{product.name}</h4>
              <p>{product.description}</p>
              <input
                name={`quantity-product-${index}`}
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                readOnly
              />
              {product.quantity < 1 ? (
                <span data-product={index} className="price disabled">
                  {product.price} USD
                </span>
              ) : (
                <button
                  data-product={index}
                  className="price"
                  onClick={() => handleAddToCartClick(product, 1, index)}
                >
                  {product.price} USD
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
