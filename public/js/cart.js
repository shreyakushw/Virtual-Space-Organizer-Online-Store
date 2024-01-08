const createSmallCards = (data) => {
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" alt="">
        <div class="sm-text">
            <p class="sm-product-name">${data.name}</p>
            <p class="sm-des">${data.shortDes}</p>
        </div>
        <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
        </div>
        <p class="sm-price" data-price="${data.price}">Rs.${data.price * data.item}</p>
        <button class="sm-delete-btn"><img src="img/close.png" alt="" srcset=""></button>
    </div>
    `
}

let totalBill = 0;

const setCartProducts = () => {
    const cartContainer = document.querySelector('.cart-container')

    let cart = JSON.parse(localStorage.getItem('cart'));
    if(cart == null || !cart.length){
        cartContainer.innerHTML += `<img src="img/empty-cart.png" class="empty-img" alt="">`
    } else{
        for(let i=0; i<cart.length; i++){
            cartContainer.innerHTML += createSmallCards(cart[i]);
            totalBill += Number(cart[i].price * cart[i].item);

            updateBill()
        }
    }
    setupCardEvents();
}

const updateBill = () => {
    updateNavCartCounter();
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `Rs.${totalBill}`;
}

const setupCardEvents = () => {
    const counterMinus = document.querySelectorAll('.cart-container .decrement');
    const counterPlus = document.querySelectorAll('.cart-container .increment');
    const counts = document.querySelectorAll('.cart-container .item-count');
    const price = document.querySelectorAll('.cart-container .sm-price');
    const deleteBtn = document.querySelectorAll('.cart-container .sm-delete-btn');

    let product = JSON.parse(localStorage.getItem('cart'));

    counts.forEach((item, i) => {
        let cost = Number(price[i].getAttribute('data-price'));

        counterMinus[i].addEventListener('click', () => {
            if(item.innerHTML > 1){
                item.innerHTML--;
                totalBill -= cost;
                updateBill();
                price[i].innerHTML = `Rs.${item.innerHTML * cost}`;
                product[i].item = item.innerHTML;
                localStorage.setItem('cart', JSON.stringify(product));
            }
        })
        counterPlus[i].addEventListener('click', () => {
            if(item.innerHTML < 9){
                item.innerHTML++;
                totalBill += cost;
                updateBill();
                price[i].innerHTML = `Rs.${item.innerHTML * cost}`;
                product[i].item = item.innerHTML;
                localStorage.setItem('cart', JSON.stringify(product));
            }
        })
    })

    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            product = product.filter((data, index) => index != i);
            localStorage.setItem('cart', JSON.stringify(product))
            location.reload();
        })
    })
}

setCartProducts();