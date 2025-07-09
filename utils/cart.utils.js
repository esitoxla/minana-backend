export const updateCartTotals = (cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.subtotal = subtotal;
    cart.total = subtotal;
};