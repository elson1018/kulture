import React from "react";  
import './ProductCard.css';

function ProductCard({title , imageUrl , price , productID , onAddToCart}){//needed props for this card component

  
  return (
    <>
        <div  className="product-card">

          <img src ={imageUrl} /> {/* Placeholder for the images */}
          <h2 className="product-title">{title}</h2>
          <span className="product-price">{price}</span><br></br>
          <button onClick={() => onAddToCart(productID)}>Add to Cart</button>
          
        </div>
    </>
  )
}

export default ProductCard;
