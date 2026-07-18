import { useState } from "react";
import { addProduct } from "../services/ProductService";
import { ActionButton, Card, PageContainer, PageHeader } from "../components/ui";

function ProductPage() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async () => {
    try {
      const response = await addProduct(name, quantity, price);
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
    <PageContainer>
      <PageHeader title="Products" description="Capture product-level context while keeping the existing service behavior intact." />
      <Card title="Add product" description="Create a lightweight product entry using the existing workflow.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Product name</span>
            <input className="input" type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field-group">
            <span className="field-label">Quantity</span>
            <input className="input" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </label>
          <label className="field-group">
            <span className="field-label">Price</span>
            <input className="input" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </label>
        </div>
        <div className="u-flex u-gap-3 u-wrap u-mb-2" style={{ marginTop: "1rem" }}>
          <ActionButton variant="primary" onClick={handleSubmit}>Save product</ActionButton>
        </div>
      </Card>
    </PageContainer>
  );
}

export default ProductPage;