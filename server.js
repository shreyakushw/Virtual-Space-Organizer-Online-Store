

import express from "express";
import bcrypt from "bcrypt";
import fs from 'fs/promises';
import path from 'path';
import bodyParser from 'body-parser';

import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc, getDocs, query, where, deleteDoc,limit } from "firebase/firestore";

//web app Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDikbGMq6P9Dwr0FpgdwuHMvQsBGxbFUc4",
    authDomain: "virtual-space-organizer-6a07f.firebaseapp.com",
    projectId: "virtual-space-organizer-6a07f",
    storageBucket: "virtual-space-organizer-6a07f.appspot.com",
    messagingSenderId: "839433178458",
    appId: "1:839433178458:web:3eb4eb6375e9098115b763"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

//init server
const app = express(); 

const port = 3000;
//const bodyParser = require('body-parser');
//const fs = require('fs').promises;
//const path = require('path');

//middlewares
app.use(express.static("public"));
app.use(express.json()) //enables form sharing
app.use(bodyParser.json());

// routes
// home route



app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" })
})

// signup
app.get('/signup', (req, res) => {
    res.sendFile("signup.html", { root : "public" })
})

app.post('/signup', (req, res) => {
    const {name, email, password, number} = req.body;

    //form validation
    if(name.length < 3){
        res.json({'alert' : 'name must be 3 letters long'});
    } else if(!email.length){
        res.json({'alert' : 'enter your email'});
    } else if(password.length < 8){
        res.json({'alert' : 'password must be 8 letters long'});
    } else if(!Number(number) || number.length < 10){
        res.json({'alert' : 'invalid number, please enter valid one'});
    }else{
        //store data in database
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({'alert' : 'email already exists'});
            }else{
                //encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        //set doc
                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller,
                            })
                        })
                    });
                })
            }
        })
    }
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", {root : "public"})
})

app.post('/login', (req, res) => {
    let {email, password} = req.body;

    if(!email.length || !password.length){
        res.json({'alert' : 'fill all the inputs'})
    }

    const users = collection(db, "users");

    getDoc(doc(users, email))
    .then(user => {
        if(!user.exists()){
            return res.json({'alert' : 'email does not exists'});
        } else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                } else{
                    return res.json({'alert' : 'password is incorrect'});
                }
            })
        }
    })
})

app.get('/product-page', (req, res) => {
    res.sendFile("product-page.html", { root : "public" })
})

//seller route
app.get('/seller', (req, res) => {
    res.sendFile('seller.html', {root : "public"})
})

app.post('/seller', (req,res) => {
    let{name, address, about, number, email} = req.body;

    if(!name.length || !address.length){
        res.json({'alert' : 'some information(s) is/are incorrect/missing'});
    } else{
        //update seller status
        const sellers = collection(db, "sellers");
        setDoc(doc(sellers, email), req.body)
        .then(data => {
            const users = collection(db, "users");
            updateDoc(doc(users, email), {
                seller: true
            })
            .then(data => {
                res.json({'seller': true})
            })
        })
    }
})

//dashboard
app.get('/dashboard', (req,res) => {
    res.sendFile('dashboard.html', {root : "public"});
})

app.post('/spreadsheetURL', async (req, res) => {
    const { base64, type, name } = req.body;

    // Save the file on the server
    const uploadDir = path.join(__dirname, 'uploads');
    const filePath = path.join(uploadDir, name);

    try {
        // Create the 'uploads' directory if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true });

        // Write the base64 data to the file
        await fs.writeFile(filePath, base64, 'base64');

        // Construct the URL to send back to the client
        const serverURL = `http://localhost:${port}`;
        const fileURL = `${serverURL}/uploads/${name}`;

        // Send the file URL as the response
        res.send(fileURL);
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).send('Internal Server Error');
    }
});

// add product
app.get('/add-product',(req,res) => {
    res.sendFile('add-product.html', {root : "public"});
})

app.get('/product.html',(req,res)=>{
    res.sendFile("product.html", {root : "public"})
})

app.get('/add-product/:id',(req,res) => {
    res.sendFile('add-product.html', {root : "public"});
})

//imgUrl
// app.get('/add-product', (req, res) => {
//     const imageUrl = process.env.imageUrl;
//     // Use imageUrl in your application logic
//     // For instance, pass it to a template or use it in a response
//     res.send(`<img src="${imageUrl}" alt="Image">`);
//     // Or use it in any way that suits your application
// });


app.post('/add-product', (req, res) => {
    let{name, shortDes, detail, price, image, tags, email, draft, id} = req.body;

    if(!draft){
        if(!name.length){
            res.json({'alert' : 'should enter product name'});
        }else if(!shortDes.length){
            res.json({'alert' : 'should enter description at least 80 letters long'});
        }else if(!price.length || !Number(price)){
            res.json({'alert' : 'should enter valid price'});
        }else if(!detail.length){
            res.json({'alert' : 'must enter details'});
        }else if(!tags.length){
            res.json({'alert' : ' enter tags'});
        }
    }

    let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random()*50000)}` : id;

    let products = collection(db, "products");
    setDoc(doc(products, docName), req.body)
    .then(data => {
        res.json({'product' : name})
    })
    .catch(err => {
        res.json({'alert' : 'some error occured'})
    })
})

app.post('/get-products', (req, res) => {
    let {email, id, tag} = req.body

    let products = collection(db, "products");
    let docRef;

    // let imageUrl;

    if(id){
        docRef = getDoc(doc(products, id));
    } else if(tag) {
        docRef = getDocs(query(products, where("tags", "array-contains", tag)))
    }
    else{
        docRef = getDocs(query(products, where("email", "==", email)))
    }

    docRef.then(products => {
        if(products.empty){
            return res.json('no products');
        }
        
        let productArr = [];

        if(id){
            // const data = docRef.data();
            // data.id = docRef.id;

            // data.image = imageUrl;

            return res.json(products.data());
        } else{
            products.forEach(item => {
                let data = item.data();
                data.id = item.id;
                // data.image = imageUrl;
                productArr.push(data);
            })    
        }
        
        res.json(productArr);
    })
})

app.post('/delete-product', (req, res) => {
    let {id} = req.body;
    deleteDoc(doc(collection(db, "products"), id))
    .then(data => {
        res.json('success');
    })
    .catch(err => {
        res.json('err');
    })
})



app.get('/products/:id',(req,res) => {
    res.sendFile("product.html" , {root : "public"})
})

//review

app.post('/add-review', (req, res) => {
    let { headline, review, rate, email, product } = req.body;
    
    // form validations
    if(!headline.length || !review.length || rate == 0 || email == null || !product){
        return res.json({'alert':'Fill all the inputs'});
    }

    // storing in Firestore
    let reviews = collection(db, "reviews");
    let docName = `review-${email}-${product}`;

    setDoc(doc(reviews, docName), req.body)
    .then(data => {
        return res.json('review')
    }).catch(err => {
        console.log(err)
        res.json({'alert': 'some err occured'})
    });
})

app.post('/get-reviews', (req, res) => {
    let { product, email } = req.body;

    let reviews = collection(db, "reviews");

    getDocs(query(reviews, where("product", "==", product)), limit(4))
    .then(review => {
        let reviewArr = [];

        if(review.empty){
            return res.json(reviewArr);
        }

        let userEmail = false;

        review.forEach((item, i) => {
            let reivewEmail = item.data().email;
            if(reivewEmail == email){
                userEmail = true;
            }
            reviewArr.push(item.data())
        })

        if(!userEmail){
            getDoc(doc(reviews, `review-${email}-${product}`))
            .then(data => reviewArr.push(data.data()))
        }

        return res.json(reviewArr);
    })
})


app.get('/cart', (req, res) => {
    res.sendFile("cart.html", {root : "public"})
})

// 404 route
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" })
})
    
app.use((req, res) => {
    res.redirect('/404')
})

app.listen (3000, () => {
    console.log('listening on port 3000');
})