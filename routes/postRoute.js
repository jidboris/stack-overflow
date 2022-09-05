const express = require("express");
const router = express.Router();
const CORS = require("cors");
const postModel = require("../modules/postModel");
const { mongoose } = require('mongoose');
const userController = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
router.use(express.json())


const uri = 'mongodb://localhost:27017/post'
mongoose
    .connect(uri, { useNewUrlParser: false, useUnifiedTopology: false })
    .then(() => console.log("Database Connected"))
    .catch((err) => { console.log(err) });

router.post('/userSignup', userController.create);
router.post('/login', authMiddleware, userController.authenticate);


// for each user to enter their post details
router.post('/', authMiddleware,(req, res) => {
    const newPost = new postModel(
        {
            Title: req.body.Title,
            Content: req.body.Content
        });

    newPost.save()

    res.json(
        newPost
    )
    console.log('New post', newPost)
});
//This logic extracts all the posts by A USER.
router.get('/', async (req, res) => {
    const Posts = await postModel.find()

    console.log('Posts', Posts)
    res.json(Posts)
});

//Logic uses the parcel id to get One Post of a user
router.get('/:id', async (req, res) => {
    const Post = await postModel.findById(req.params.id).exec();
    if (!Post) {
        res.status(404).send('Post with the given id does not exist')
    }

    else {
        res.json(Post)
        console.log('post', Post)
    }
});
//Logic to get the Title of a particular post
router.get('/postTitle/:id', async (req, res) => {
    const Post = await postModel.findById(req.params.id).exec();
    if (!Post) {
        res.status(404).send('Post with the given id does not exist')
    }
    else {
        Post.Title = req.body.Title
        const PI = Post.Title
        res.json(PI)
        console.log('post', Post.Title)
    }
});

// Logic edits the post details
router.put('/postEdit/:id', async (req, res) => {
    const Post = await postModel.findById(req.params.id);
    console.log(Post)
    if (!Post) {
        res.status(404).send('post with the given id does not exist')
    }
    else {
        Post.Content = req.body.Content
        Post.attributes = req.body.attributes
        const editPost = await Post.save()
        console.log(editPost)
        res.json(editPost)
    }
});

// Logic for deleting a post
router.delete('/postDelete/:id', async (req, res) => {
    const Post = await postModel.findByIdAndRemove(req.params.id).exec()
    console.log('Post index', Post)
    if (!Post) res.status(404).send('post with the given id does not exist')
    const deletePost = await Post
    res.send('post deleted succesfully')
    console.log('deleted post', deletePost)
});


module.exports = router