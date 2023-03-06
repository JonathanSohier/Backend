const express = require("express"); 
const { rootCertificates } = require("tls");
const router = express.Router();
const Post = require('./models/post');
const RESPONSE_MESSAGES = require('./constants/response_messages');

rooter.use((req,res,next)=>{
    delete req.body.id;
    delete req.body.__v;

    next();
});

// Récupération de tous les posts
router.get('/',async(req,res)=>{
    const posts = await Post.find({});
    res.json(posts);
})

// Récupérattion par id
router.get('/:id',async(req,res)=>{
   try{
         const post = await Post.findOne({id: req.params.id}).lean().exec();
         if(!post){
              return res.status(404).json({msg:'Fichier non trouvé'})
         }
         res.header('location', "http://location:4001/blog/${post.id}");
         res.status(200).json(post);
    } catch(err){
         res.status(500).send(err.message);
    }
})

// Créer un Post
router.post('/',async(req,res)=>{
    

    const post = new Post(req.body);

    try {
        await post.save();

        res.header('location', "http://location:4001/blog/${post.id}");
        res.status(201).json(post);
    }catch(err) {
        res.status(500).send(err.message);
    }
})

// Modifier un post
router.patch('/:id', async(req,res)=>{
    try{
        const post = await Post.findOne({id: req.params.id}).lean().exec();
        if(!post){
             return res.status(404).json({msg:'post not found'})
        }
        await Post.updateOne(
            {id: req.params.id},
            {$set: {title: req.body.title, content: req.body.content}});
        res.header('location', "http://location:4001/blog/${post.id}");
        res.status(200).json("Fichier bien modifié");
   } catch(err){
        res.status(500).send(err.message);
   }
})

// Supprimer un post
router.delete('/:id',async(req,res)=>{
    try{
        const post = await Post.findOne({id: req.params.id}).lean().exec();
        if(!post){
             return res.status(404).json({msg:'post not found'})
        }
        await Post.deleteOne({id: req.params.id});
        res.header('location', "http://location:4001/blog/${post.id}");
        res.status(200).json("Fichier bien supprimé");
   } catch(err){
        res.status(500).send(err.message);
   }
})

module.exports = router;