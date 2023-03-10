const express = require("express");
const { _lengthValidator } = require("./validator");
const router = express.Router();
const Post = require("./models/post");
const {getAll, getById, createPost, deletePost, updatePost} = require("./controllers/post_controller");
const {getAllComments, getByID, createComment, deleteComment} = require("./controllers/comment_controller");

router.use((req, res, next) => {
    delete req.body.id;
    delete req.body.__v;

    next();
});

const postExistsMiddleware = async function (req, res, next) {
    const post = await Post.findOne({ id: req.params.id }).lean().exec();
    if(!post) {
        return res.status(404).json({msg: 'post not found'});
    }

    req.post = post;

    next();
}

const contentBodyMiddleware = function (req, res, next) {
    const content = req.body.content;

    if(!content) {
        return res.status(400).json({msg: 'content is required'});
    }

    if(!_lengthValidator(content, 10, 200)) {
        return res.status(400).json({msg: '10 < content < 200'});
    }

    next();
}



// GET ALL (/) retourné en JSON TOUS les posts
router.get('/', getAll);

// GET BY ID (:id) retourné en JSON un post
router.get('/:id', getById);

// POST (/) créer un post
router.post('/', contentBodyMiddleware, createPost);

// PATCH (:id) modifier un post
router.patch('/:id', postExistsMiddleware, contentBodyMiddleware, updatePost);

// DELETE (:id) supprimer un post
router.delete('/:id', postExistsMiddleware, deletePost);

// COMMENT
// @route   GET /blog/posts/:id/comments
router.get("/posts/:id/comments", postExistsMiddleware, getAllComments);

// @route   POST /blog/posts/:id/comments
router.post("/posts/:id/comments", postExistsMiddleware, createComment);

// @route   DELETE /blog/comments/:commentId
router.delete("/comments/:id" , deleteComment);

module.exports = router;