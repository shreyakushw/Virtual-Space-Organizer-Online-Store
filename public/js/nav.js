// const navbar = document.querySelector('.navbar');

window.addEventListener('scroll',()=>{
    if(scrollY>=180){
        navbar.classList.add('bg');
    } else{
        navbar.classList.remove('bg');
    }
    //console.log(scrollY);
})

const createNavbar = () => {
    let navbar = document.querySelector('.navbar');

    navbar.innerHTML += `
    <ul class="links-container">
    <li class="link-item"><a href="index.html" class="link active">HOME</a></li>
    <li class="link-item"><a href="product-page.html" class="link">PRODUCT</a></li>
    <li class="link-item"><a href="about.html" class="link">ABOUT </a></li>
    <li class="link-item"><a href="dashboard.html" class="link"> DASHBOARD </a></li>
    <li class="link-item"><a href="contact.html" class="link">CONTACT</a></li>
    </ul>

    <div class="user-interactions">
        <div class="cart" onclick="location.href = '/cart'">
            <img src="../img/cart.png" class="cart-icon" alt="">
            <span class="cart-item-count">00</span>
        </div>
        <div class="user">
            <img src="../img/user.png" class="user-icon" alt="">
            <div class="user-icon-popup">
                <p>login to your account</p>
                <a>login</a>
            </div>
        </div>
    </div>
    `
}

createNavbar();

//user icon popup
let userIcon = document.querySelector('.user-icon');
let userPopupIcon = document.querySelector('.user-icon-popup');

userIcon.addEventListener('click', () => userPopupIcon.classList.toggle('active'))

let text = userPopupIcon.querySelector('p');
let actionBtn  = userPopupIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

if(user != null){
    text.innerHTML  = `login as ${user.name}`;
    actionBtn.innerHTML = 'log out';
    actionBtn.addEventListener('click', () => logout());
} else{
    text.innerHTML = 'login to your account';
    actionBtn.innerHTML = 'login';
    actionBtn.addEventListener('click', () => location.href = '/login');
}

const logout = () => {
    sessionStorage.clear()
    location.reload();
}

const updateNavCartCounter = () => {
    let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if(cartItem == null){
        cartCounter.innerHTML = '00';
    } else{
        if(cartItem.length > 9){
            cartCounter.innerHTML = '9+';
        } else if(cartItem.length <= 9){
            cartCounter.innerHTML = `0${cartItem.length}`
        }
    }
}

updateNavCartCounter();