import { ProductModel } from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const { filter = "{}", sort = "{}", limit = 50, skip = 0 } = req.query;

    const products = await ProductModel.find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.status(200).json(products);
  } catch (error) {
    res.status(422).json({ message: "Failed to fetch products", error });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid ID format or failed to fetch", error });
  }
};




export const postProduct = async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const image = req.file?.path; // cloudinary image URL

    const newProduct = new ProductModel({
      name,
      description,
      price,
      image,
      category,
      inStock,
    });

     await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // enforce schema rules
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update product", error });
  }
};

  
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error); 
    res.status(400).json({ message: "Failed to delete product", error });
  }
};

