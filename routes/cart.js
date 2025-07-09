import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cart.js";

const cartRouter = Router();

cartRouter.get('/', getCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update', updateCartItem);
cartRouter.delete('/remove', removeFromCart);

export default cartRouter;