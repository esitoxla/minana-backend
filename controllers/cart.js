import { Cart } from "../models/cart.js";
import { updateCartTotals } from "../utils/cart.utils.js";
import { ProductModel } from "../models/productModel.js";

export const getCart = async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { items: [], subtotal: 0, total: 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
};



//adding to cart
export const addToCart = async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const { productId, name, category, pricePerUnit, quantity } = req.body;

  //  Step 1: Validate required fields
  if (!productId || !name || !pricePerUnit || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (quantity <= 0 || pricePerUnit <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity and price must be positive" });
  }

  try {
    //  Step 2: Fetch actual product from DB to avoid trusting client
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const actualPrice = product.price;
    const productImage = product.image;

    let cart = await Cart.findOne({ userId });

    const totalPrice = actualPrice * quantity;

    const newItem = {
      productId,
      name,
      category,
      pricePerUnit: actualPrice,
      quantity,
      totalPrice,
      image: productImage,
    };

    if (!cart) {
      cart = new Cart({ userId, items: [newItem] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity of existing item
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].totalPrice =
          cart.items[itemIndex].quantity * actualPrice;
      } else {
        cart.items.push(newItem);
      }
    }

    updateCartTotals(cart);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};
  




// Update quantity of a cart item
export const updateCartItem = async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    item.totalPrice = item.pricePerUnit * quantity;

    updateCartTotals(cart);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};



// Remove item from cart
export const removeFromCart = async (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
  
    const { productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  
      updateCartTotals(cart);
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  };