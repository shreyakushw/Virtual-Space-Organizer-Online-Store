let ratingStarInput = [...document.querySelectorAll('.rating-star')];
let rate = 0;

ratingStarInput.map((star,index)=> {
    rate = `${index + 1}.0`;
    star.addEventListener('click' , ()=>{
        for(let i=0 ; i<5 ; i++){
            if(i <= index){
                ratingStarInput[i].src = `../img/fill star.png`;

            }else{
                ratingStarInput[i].src = `../img/no fill star.png`;
            }
        }
    })

})

// let user = JSON.parse(sessionStorage.user || null);

let reviewHeadline = document.querySelector('.review-headline');
let review = document.querySelector('.review-field');
let loader = document.querySelector('.loader');

let addReviewBtn = document.querySelector('.add-review-btn');

addReviewBtn.addEventListener('click', () => {
    if(user == null){
        location.href = `/login?after_page=${productId}`
    } else{
        if(!reviewHeadline.value.length || !review.value.length || rate == 0){
            showFormError('Fill all the inputs');
        } else if(reviewHeadline.value.length > 50){
            showFormError('headline should not be more than 50 letters')
        } else if(review.value.length > 150){
            showFormError('review should not be more than 150 letters')
        } else{
            // send the data to backend
            loader.style.display = "block";
            sendData('/add-review', {
                headline: reviewHeadline.value,
                review: review.value,
                rate: rate,
                email: user.email,
                product: productId
            })
        }
    } 
})

const getReviews = () => {
    if(user == null){
        user = {
            email: undefined
        }
    }

    // sendData('/get-reviews', {
    //     email : user.email,
    //     product: productId
    // })
    // .then(res => res.json())
    // .then (data => {
    //     if(data.length){
    //         console.log(data);
    //     }
    // })

    fetch('/get-reviews', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            email: user.email,
            product: productId
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.length){
            createReviewSection(data)
        }
    })
}

const createReviewSection = (data) => {
    let section = document.querySelector('.review-section');

    section.innerHTML += `
        <h1 class="section-title">Reviews</h1>
        <div class="review-container">
            ${createReviewCard(data)}
        </div>
    `
}

const createReviewCard = data => {
    let cards = '';

    for(let i = 0; i < 4; i++){
        if(data[i]){
            cards += `
            <div class="review-card">
                <div class="user-dp" data-rating="${data[i].rate}"><img src="../img/user-icon.png" alt=""></div>
                <h2 class="review-title">${data[i].headline}</h2>
                <p class="review">${data[i].review}</p>
            </div>
            `
        }
    }

    return cards;
}

getReviews();