import { useState } from "react";
import { addProduct } from "../services/productService";

function ProductPage() {

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async () => {

    try {

      const response = await addProduct(
        name,
        quantity,
        price
      );

      console.log(response);

      alert("Product Added");

      setName("");
      setQuantity(0);
      setPrice(0);

    } catch (error) {

      console.log(error);

      alert("Failed to add product");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Add Product</h1>

      <div>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      </div>

      <br />

      <div>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

      </div>

      <br />

      <div>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

      </div>

      <br />

      <button onClick={handleSubmit}>
        Save Product
      </button>

    </div>
  );
}

export default ProductPage;