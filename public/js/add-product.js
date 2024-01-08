let user = JSON.parse(sessionStorage.user || null);

window.onload =() =>{
    if(user == null){
        location.replace('/login')
    }
}

let editables = [...document.querySelectorAll('*[contenteditable="true"]')];

editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
    element.innerHTML = placeholder; 
    element.addEventListener('focus', () =>{
        if(element.innerHTML === placeholder){
            element.innerHTML = '';
        }
    })
    element.addEventListener('focusout', () => {
        if(!element.innerHTML.length){
            element.innerHTML = placeholder;
        }
    })
})

// // image url generating using spreadsheet


var imageUrl = "";
// let imageUrl = "img/noImage.png"
let spreadsheetURL = "https://script.google.com/macros/s/AKfycbz8M1CZ0AWOcxpYtn8zks47876T9q59OwuTbjndR9ZCPEEho2RicI_PIS8KhwEeA7IqIQ/exec";
let file = document.querySelector("#upload-image");
let img = document.querySelector(".product-img");
file.addEventListener('change',()=>{
    let fr = new FileReader();
    fr.addEventListener('loadend',()=>{
        let res = fr.result;
        img.src =res;
        let spt = res.split("base64,")[1];
        //console.log(spt);
        let obj = {
            base64:spt,
            type:file.files[0].type,
            name:file.files[0].name

        }
        fetch(spreadsheetURL,{
            method:"POST",
            body:JSON.stringify(obj)
        })
        .then(r=>r.text())
        .then(data=>imageUrl = data)
    })
    
    fr.readAsDataURL(file.files[0])
})


// form submission

let addProductBtn = document.querySelector(".add-product-btn");
let loader = document.querySelector(".loader");
let productName = document.querySelector(".product-title");
let shortDes = document.querySelector(".product-des");
let price = document.querySelector(".price");
let detail = document.querySelector(".des");
let tags = document.querySelector(".tags");

addProductBtn.addEventListener('click',()=>{
    //verification

    if(productName.innerHTML == productName.getAttribute('data-placeholder'))
    {
        showFormError('should enter product name');
    }else if(shortDes.innerHTML == shortDes.getAttribute('data-placeholder')){
        showFormError('should enter description at least 80 letters long');
    }else if(price.innerHTML == price.getAttribute('data-placeholder') || !Number(price.innerHTML)){
        showFormError('should enter valid price');
    }else if(detail.innerHTML == detail.getAttribute('data-placeholder')){
        showFormError('must enter details');
    }else if(tags.innerHTML == tags.getAttribute('data-placeholder')){
        showFormError(' enter tags');
    }else{
        // add to databse

        loader.style.display = "block";
        let data = productData();
        if(productId){
            data.id = productId;
        }
        sendData('/add-product',data); 
    }


})

const productData = ()=>{
    let tagArr = tags.innerText.split(",");
    tagArr.forEach((item, i) => tagArr[i].trim().toLowerCase());

    return {
        name: productName.innerHTML,
        shortDes: shortDes.innerHTML,
        price: price.innerHTML,
        detail: detail.innerHTML,
        tags: tagArr,
        image: imageUrl,
        email: JSON.parse(sessionStorage.user).email,
        draft : false
    }
}

let draftBtn = document.querySelector('.draft-btn');
draftBtn.addEventListener('click',()=>{
    if(!productName.innerHTML.length || productName.innerHTML == productName.getAttribute('data-placeholder')){
        showFormError('enter product name atleast');
    }
    else{
        let data = productData();
        loader.style.display = 'block';
        data.draft=true;
        if(productId){
            data.id = productId;
        }
        sendData('/add-product',data)
    }
})



const fetchProductData =()=>{
    addProductBtn.innerHTML = 'save product';
    fetch('/get-products',{
        method:'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id:productId}) 
    }).then(res => res.json())
    .then(data =>{
        console.log(imageUrl);
        setFormData(data)
    })
    .catch(err=>console.log(err))
}
const setFormData = (data)=>{
    productName.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    price.innerHTML = data.price;
    detail.innerHTML = data.detail;
    tags.innerHTML = data.tags;
    let productImg = document.querySelector('.product-img')
     
    productImg.src = imageUrl = data.image;
}
let productId = null;
if(location.pathname != '/add-product'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}