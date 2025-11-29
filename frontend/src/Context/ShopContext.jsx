import React, { createContext, useState } from 'react';

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity,
        }));
        // FIX: Changed single quotes ' to backticks ` for variable text
        console.log(`Added item ${itemId} with quantity ${quantity}`);
    };

    const removeFromCart = (itemId) => {
        // FIX: Changed setCartItem to setCartItems (added 's')
        setCartItems((prev) => {
            const newCart ={...prev};
            delete newCart[itemId];
            return newCart;
        });
    };

    const updateCartItemCount = (newAmount, itemId) =>{
        setCartItems((prev) => ({
            ...prev,
            [itemId]: newAmount
        }));
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getTotalCartItems,
    };

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};