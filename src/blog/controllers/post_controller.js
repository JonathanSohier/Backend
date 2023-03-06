const Post = require("../models/post");

//Créer un Post
const createPost = async (req, res) => {
    const post = new Post(req.body);
    try {
        await post.save();

        res.header("Location", `http://localhost:3001/blog/posts/${post.id}`);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getAll = async (req, res) => {
    const {page =  1, limit = 10} = req.query;

    try {
        const posts = await Post.find({})
            .limit(limit)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        const count = await Post.find().countDocuments();
        res.status(200).json({
            posts : removeFields(posts),
            currentPage: page,
            totalPages: Math.ceil(count),
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const post = await Post.findOne({ id: req.params.id }).lean().exec();
        if (!post) {
            return res.status(404).json({ msg: "Fichier non trouvé" });
        }
        res.header('location', "http://location:3001/blog/${post.id}");
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;

    const update = {
        ...req.body,
        updatedAt: Date.now()
    };

    try {
        const post = await Post.findOne({id: req.params.id}).lean().exec();
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        await Post.updateOne(
            {id: req.params.id},
            {$set: {title: req.body.title, content: req.body.content}
        });
        
        res.header('location', "http://location:3001/blog/${post.id}");
        res.status(200).json("Fichier bien modifié");
   } catch(err){
        res.status(500).send(err.message);
   }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.deleteOne({ id: req.params.id }).lean().exec();
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        await Post.deleteOne({id: req.params.id});

        res.header('location', "http://location:3001/blog/${post.id}");
        res.status(200).json("Fichier bien supprimé");
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


module.exports = {
    getAll,
    getById,
    createPost,
    deletePost,
    updatePost,
}