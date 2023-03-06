const Company = require('../models/company');
const Personne = require('../models/personne');

//Créer un Profile
const createProfile = async (req, res) => {
    let profile = null;
    try {
        const{kind, ...body} = req.body;
        switch (kind) {
            case "person":
                profile = new Personne(body);
                break;
            case "company":
                profile = new Company(body);
                break;
            default:
                return res.status(400).json({msg: 'kind is required'});
        }
        
        await profile.save();

        res.header("Location", `http://localhost:3001/profile/profiles/${profile.id}`);
        res.status(201).json(profile);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

//Récupére tous les Profiles
const getAll = async (req, res) => {
    try {
        const profiles = await Profile.find({});

        res.json(profiles);
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

//Récupére un Profile par son id
const getById = async (req, res) => {
    try {
        const profile = await Profile.findOne({ id: req.params.id }).lean().exec();
        if (!profile) {
            return res.status(404).json({ msg: "Fichier non trouvé" });
        }
        res.header('location', "http://location:3001/profile/${profile.id}");
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { id } = req.params;

    const update = {
        ...req.body,
        updatedAt: Date.now()
    };

    try {
        const profile = await Profile.findOne({id: req.params.id}).lean().exec();
        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        await Profile.updateOne(
            {id: req.params.id},
            {$set: {name: req.body.name, description: req.body.description}
        });
        res.status(200).json({ msg: "Profile updated" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

//Supprime un Profile
const deleteProfile = async (req, res) => {
    try{
        const profile = await Profile.findOne({id: req.params.id}).lean().exec();
        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        await Profile.deleteOne({id: req.params.id});
        res.status(200).json({ msg: "Profile deleted" });
    }   catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    createProfile,
    getAll,
    getById,
    updateProfile,
    deleteProfile
};