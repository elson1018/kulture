import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    // Load existing cart from backend (if user is logged in and session is valid)
    useEffect(() => {
        const fetchCartFromServer = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    // No logged-in user on the frontend, skip fetching
                    return;
                }

                const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/cart', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    // Likely 401 when session expired – just ignore and keep empty cart
                    console.warn('Unable to load cart from server, status:', response.status);
                    return;
                }

                const data = await response.json();

                // Expecting { userId, items: [ { productId, quantity, ... } ] }
                if (data && Array.isArray(data.items)) {
                    const mappedItems = {};
                    data.items.forEach((item) => {
                        if (item.productId && item.quantity > 0) {
                            // Ensure keys are strings so lookups are consistent
                            mappedItems[String(item.productId)] = item.quantity;
                        }
                    });
                    setCartItems(mappedItems);
                }
            } catch (err) {
                console.error('Failed to fetch cart from server:', err);
            }
        };

        fetchCartFromServer();
    }, []);

    const clearCart = () => {
        setCartItems({}); // Wipes all items from the local state
    };

    const addToCart = (itemId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity,
        }));
        console.log(`Added item ${itemId} with quantity ${quantity}`);
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId];
            return newCart;
        });
    };

    const updateCartItemCount = (newAmount, itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: newAmount,
        }));
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
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
        clearCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};