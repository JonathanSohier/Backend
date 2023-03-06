const express = require("express");
const router = express.Router();
const {getAll, getById, createProfile, deleteProfile, updateProfile} = require("./controllers/profile_controller");

router.use((req, res, next) => {
    delete req.body.id;
    delete req.body.__v;

    next();
});

const profileExistsMiddleware = async function (req, res, next) {
    const profile = await Profile.findOne({ id: req.params.id }).lean().exec();
    if(!profile) {
        return res.status(404).json({msg: 'profile not found'});
    }

    req.profile = profile;

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

// GET ALL (/profils) retourné en JSON TOUS les profiles
router.get('/', getAll);

// GET BY ID (/profils/:id) retourné en JSON un profile
router.get('/:id', getById);

// POST (profils/) créer un profile
router.post('/', contentBodyMiddleware, createProfile);

// PATCH (profils/:id) modifier un profile
router.patch('/:id', profileExistsMiddleware, contentBodyMiddleware, updateProfile);

// DELETE (profils/:id) supprimer un profile
router.delete('/:id', profileExistsMiddleware, deleteProfile);

module.exports = router;