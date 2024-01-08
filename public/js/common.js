const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => processData(data));
}

const processData = (data) => {
    console.log(data);
    loader.style.display = null;
    if(data.alert){
        showFormError(data.alert);
    } else if(data.email){
        sessionStorage.user = JSON.stringify(data);
        
        if(location.search.includes('after')){
            let pageId = location.search.split('=')[1];
            location.replace(`/products/${pageId}`);
        } else{
            location.replace('/');
        }
    } else if(data.seller){
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.replace('/dashboard');
    } else if(data.product){
        location.replace('/dashboard');
    } else if(data == 'review'){
        alert('got review');
        location.reload();
    }
}

const showFormError = (err) => {
    let errorEle = document.querySelector('.error');
    errorEle.innerHTML = err;
    errorEle.classList.add('show');

    setTimeout(() => {
        errorEle.classList.remove('show');
    }, 2000)
}