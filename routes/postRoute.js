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

router.post('/auth/signup', userController.create);
router.post('/auth/login', authMiddleware, userController.authenticate);


// for each user to enter their post details
// swagger doucumentation of post api route
/**
 * @swagger
 * /posts:
 *  post:
 *     description: use to add a post     
 *     responses:
 *      '200':
 *        description: Post created successfully          
 */
router.post('/', (req, res) => {
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
/**
  * @swagger
  * /posts:
  *  get:
  *     summary: To get all posts
  *     description: use to get all posts  
  *     responses: 
  *         200:
  *             description: This api is used to fetch all posts          
  */
router.get('/', async (req, res) => {
    const Posts = await postModel.find()

    console.log('Posts', Posts)
    res.json(Posts)
});

//Logic uses the post id to get One Post of a user
/**
  * @swagger
  * /posts/:id/posts:
  *  get:
  *     summary: To get all post
  *     description: use this api to fetch a post 
  *     responses: 
  *         200:
  *             description: This api is used to fetch post          
  */
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
/**
  * @swagger
  * /posts/:id/post:
  *  put:
  *     summary: To edit a user post
  *     description: use this api to edit a specific user post 
  *     responses: 
  *         200:
  *             description: This api is used to update post         
  */
router.put('/edit/:id', authMiddleware, async (req, res) => {
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
/**
  * @swagger
  * /posts/:id/post:
  *  delete:
  *     summary: To get all tasks 
  *     description: use this api to delete a post 
  *     responses: 
  *         200:
  *             description: This api is used to delete post input          
  */
router.delete('/cancel/:id', authMiddleware, async (req, res) => {
    const Post = await postModel.findByIdAndRemove(req.params.id).exec()
    console.log('Post index', Post)
    if (!Post) res.status(404).send('post with the given id does not exist')
    const deletePost = await Post
    res.send('post deleted succesfully')
    console.log('deleted post', deletePost)
});


module.exports = router