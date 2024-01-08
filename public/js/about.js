const navbar=document.querySelector('.navbar');

window.addEventListener('scroll',()=>{
    if(scrollY>=100){
        navbar.style.backgroundColor('#eee6e6d6 ');
    } else{
        navbar.style.backgroundColor('transparent');
    }
    console.log(scrollY);
})