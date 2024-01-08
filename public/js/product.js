// product page setting
let productName = document.querySelector('.product-title');
let shortDes= document.querySelector('.product-des');
let price= document.querySelector('.price');
let detail= document.querySelector('.des');
let productImage = document.querySelector('.product-image');
let title = document.querySelector('title');

let cartBtn = document.querySelector('.cart-btn');

const setData =(data) =>{
    productName.innerHTML = title.innerHTML = data.name;
    productImage.src  = data.image;
    shortDes.innerHTML =  data.detail;
    price.innerHTML = `Rs.${data.price}`;

    cartBtn.addEventListener('click', () => {
        cartBtn.innerHTML = add_product_to_cart(data);
    })
}

const fetchProductData =() =>{
    fetch('/get-products',{
        method:'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id:productId}) 
    })
    .then(res => res.json())
    .then(data =>{
        // console.log(imageUrl);
        setData(data)
       // getProduct(data.tags[0]).then(res => createProductCards(res, 'similar products' ,'.best-selling-product-section'))

    })
    .catch(err=> {
        console.log(err)
        alert('no product found');
        location.replace('/404')

    })
}

let productId = null;
if(location.pathname != '/add-product'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}