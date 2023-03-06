const Comment = require("../models/comment");

//Créer un Comment
const createComment = async (req, res) => {
    const comment = new Comment({
        comment : req.body.comment,
        post : req.params.id,
    });

    try {

        //req.post.commentsCount++;

        //await Promise.all([req.post.save(), comment.save()]);


        res.header("Location", `http://localhost:3001/blog/comments/${comment.id}`);
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({});

        res.json(comments);
        res.status(200).json(removeFields(comments));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const getById = async (req, res) => {
    try {
        const comment = await Comment.findOne({ id: req.params.id }).lean().exec();
        if (!comment) {
            return res.status(404).json({ msg: "Fichier non trouvé" });
        }

        res.header('location', `http://location:3001/blog/${comment.id}`);
        res.status(200).json(removeFields(comment));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const updateComment = async (req, res) => {
    const { id } = req.params;

    const update = {
        ...req.body,
        updatedAt: Date.now()
    };

    try {
        const comment = await Comment.findOne({id: req.params.id}).lean().exec();
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }
        await Comment.updateOne(
            {id: req.params.id},
            {$set: {content: req.body.content}
        });

        res.header('location', `http://location:3001/blog/${comment.id}`);
        res.status(200).json("Fichier modifié");
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({id: req.params.id}).lean().exec();
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }
        await Comment.deleteOne({id: req.params.id});

        // let post = await Post.findOne({id : req.params.post}).lean().exec();

        // post.commentCount--;

        // await post.save();

        res.header('location', `http://location:3001/blog/${comment.id}`);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}




module.exports = {
    getAllComments,
    getById,
    createComment,
    deleteComment,
    updateComment,
}