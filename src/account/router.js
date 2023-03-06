const express = require('express');
const Post = require("../blog/models/post");
const router = express.Router();
const authenticate = require("../../middlewares/authenticate");
const {getById, getAll, deleteAccount, updateAccount, login, register} = require("./controllers/account_controller");

router.post("/login", login);

router.post("/register", register);

router.get("/verify", authenticate, (req, res) => {
    res.status(200).json({ id: req.id, email: req.email });
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
    const email = req.body.email;

    if(!email) {
        return res.status(400).json({msg: 'content is required'});
    }

    next();
}

// GET ALL (/users) retourné en JSON TOUS les users
router.get('/', getAll);

// GET BY ID (/users/:id) retourné en JSON un user
router.get('/:id', getById);

// PATCH (/users/:id) modifier un user
router.patch('/:id', postExistsMiddleware, updateAccount);

// DELETE (/users/:id) supprimer un user
router.delete('/:id', postExistsMiddleware, deleteAccount);




module.exports = router;