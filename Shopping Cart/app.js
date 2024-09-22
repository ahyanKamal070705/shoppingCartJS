let iconCart = document.querySelector(".icon-cart");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let listProduct = document.querySelector(".listProduct");
let iconCartSpan = document.querySelector('.icon-cart span');
let listCart = document.querySelector('.listCart');

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

let pageItem = [];
const productInfo = async () => {
  // get data from json
  try {
    const data = await fetch("products.json");
    const response = await data.json(); // `response` now properly declared
    // i will access this in CartItem wala portion  
    pageItem=response;
    console.log(pageItem);
    console.log(response);
    renderCards(response); // assuming renderCards is your rendering function
  } catch (error) {
    console.log("Error:", error);
  }
};

function renderCards(response) {
  response.forEach((element) => {
    let newProduct = document.createElement("div");
    newProduct.classList.add("item");
    newProduct.dataset.id = element.id;
    newProduct.innerHTML = `       <img src="${element.image}">
            <h2>${element.name}</h2>
            <div class="price">${element.price}</div>
             <button class="addCart" >Add to cart</button>`;

             listProduct.appendChild(newProduct);
  });
}

//adding listener to add to cart wala function not neccesarily need to fetch

listProduct.addEventListener("click", (event)=>{
 let whatIClicked = event.target;
//  console.log( whatIClicked);
if(whatIClicked.classList.contains('addCart')){
  let productId = whatIClicked.parentElement.dataset.id;

  //we know what we have to pass so know we will passs it to add to cart function
  addToCart(productId);
  
}

 
})

 
//signifies nothing is added in the cart
let carts =[];

// abhi cart ka array banare hai bus diplay baaad mein karenge
function addToCart(productId){
   // to find this product is there or not if prestn return index or else -1
   let isProductPresent = findIndexOfElement(carts,productId);
  // no item is there in the cart
 if(carts.length==0){
 carts =[
      {
        product_id : productId,
        quantity :1,
      }
        ]
 }
 // a new item is added not  same as previous one
 else if(isProductPresent <0){                                                        
   carts.push(
    {
      product_id:productId,
      quantity:1,
    }
   )
 }else{
   // an item which is already present is added
   carts[isProductPresent].quantity += 1;
 }
//  console.log(carts);
// now display cart to the web
addCartToHTML();
}
 

// const addCartToHTML =() =>{
//   //delete the newlist render all from starting updating all the content
//   listCart.innerHTML ='';
//  if(carts.length>0){
//   carts.forEach((cart)=>{
       
//     let newCart = document.createElement('div');
//     newCart.classList.add('item2');
   
//     let info = pageItem[indexOfProduct];
//     console.log(info);
//     newCart.innerHTML =`
//      <div class="image">
//                     <img src="${info.image}" alt="">
//                 </div>
//                 <div class="name">
//                    ${info.name}
//                 </div>
//                 <div class="totalPrice">
//                     ${info.price}
//                 </div>
//                 <div class="quantity">
//                     <span class="minus"><</span>
//                     <span>${cart.quantity}</span>
//                      <span class="plus">></span>
//                 </div>` ;

//                 listCart.appendChild(newCart);
//   })
//  }
// }

//increase the iconCart wala span
let totalQuantity =0;

const addCartToHTML = () => {
  // Clear the cart display
  listCart.innerHTML = '';
  totalQuantity =0;

  if (carts.length > 0) {

    //har baar yeh refresh hoga and naya se render hoga , toh us time cart array mein jitna item hai sb render krega agr kisika ka value 0 ho gaya toh hatana hoga usko bhi
    carts.forEach((cart) => {
      // Find the product in the pageItem array that matches the cart's product_id
      
      totalQuantity = totalQuantity+cart.quantity;
    
      
      let productInfo = pageItem.find(product => product.id == cart.product_id);
      //  console.log(productInfo);
      if (productInfo) {
        let newCart = document.createElement('div'); 
        newCart.dataset.id = cart.product_id;
        newCart.classList.add('item2');

        newCart.innerHTML = `
          <div class="image">
            <img src="${productInfo.image}" alt="">
          </div>
          <div class="name">
            ${productInfo.name}
          </div>
          <div class="totalPrice">
            ${productInfo.price * cart.quantity} <!-- Total price based on quantity -->
          </div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>
        `;

        listCart.appendChild(newCart);
      }
    });

    iconCartSpan.innerHTML = totalQuantity;
  }else{
    iconCartSpan.innerHTML = 0;
  }
};


function findIndexOfElement(carts,productId){
  return carts.findIndex( function(cartItems){
    return cartItems.product_id == productId;
  })
}

// Call the function
productInfo();

//handling the plus and minus button
listCart.addEventListener("click",(event)=>{
   let whatClicked = event.target;
   console.log(whatClicked);

   if(whatClicked.classList.contains('minus') || whatClicked.classList.contains('plus')){
    //arrow located insid btn then btn inide item2 and item2 contains dataset unique id
      let operationProductId = whatClicked.parentElement.parentElement.dataset.id;
      // now whether to add or subtract
      let type = 'minus';
      if (whatClicked.classList.contains('plus')){
        type='plus';
      }

      performeOperation( operationProductId , type);

   }
})

// hm ui pe changes nahi karenge woh cart wala array pe changes karenge and woh ui change wala function call kr denge
function performeOperation(operationProductId , type){
  let positionItemInCart = carts.findIndex((cart)=> cart.product_id==operationProductId );
  console.log(positionItemInCart);
  
  if(positionItemInCart>=0){
    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity+=1;
        break;
    
      default:
         let valueChange = carts[positionItemInCart].quantity- 1;
        if(valueChange>0){
          carts[positionItemInCart].quantity-=1;
        }else{
          // agar value zero ho gaya toh cart ka array se remove krna hoga
          carts.splice(positionItemInCart,1); // from this index remove one element

        }

        break;
    }
  }
  addCartToHTML();

}
