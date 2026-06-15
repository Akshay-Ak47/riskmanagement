import { invoke } from "@tauri-apps/api/core";

export const addProduct = async (
  name: string,
  quantity: number,
  price: number
) => {

  return await invoke("add_product", {
    name,
    quantity,
    price
  });

};