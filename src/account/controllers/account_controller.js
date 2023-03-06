const Account = require('../models/account');
const {emailValidator, passwordValidator} = require('../validator');
const { getUrl } = require("../../../utils/getter");

//Créer un account
const createaccount = async (req, res) => {
    const {email, password }= req.body;
    const account = new Account({
        email : email,
        pasword : password,
    });

    try {
        await account.save();

        res.header("Location", `http://localhost:3001/account/accounts/${account.id}`);
        res.status(201).json(account);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

//Récupére tous les accounts
const getAll = async (req, res) => {
    try {
        const accounts = await account.find({});

        res.json(accounts);
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

//Récupére un account par son id
const getById = async (req, res) => {
    try {
        const account = await account.findOne({ id: req.params.id }).lean().exec();
        if (!account) {
            return res.status(404).json({ msg: "Fichier non trouvé" });
        }
        res.header('location', "http://location:3001/account/${account.id}");
        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

//Modifie un account
const updateAccount = async (req, res) => {
    const { id } = req.params;

    const update = {
        ...req.body,
        updatedAt: Date.now()
    };

    try {
        const account = await account.findOne({id: req.params.id}).lean().exec();
        if (!account) {
            return res.status(404).json({ msg: "account not found" });
        }
        await account.updateOne(
            {id: req.params.id},
            {$set: {email: req.body.email, password: req.body.password}
        });
        
        res.header('location', "http://location:3001/account/${account.id}");
        res.status(200).json("Fichier bien modifié");
   } catch(err){
        res.status(500).json({ msg: err.message });
    }
};

//Supprime un account
const deleteAccount = async (req, res) => {
    try {
        const account = await account.findOne({id: req.params.id}).lean().exec();
        if (!account) {
            return res.status(404).json({ msg: "account not found" });
        }
        await account.deleteOne({id: req.params.id});
        res.status(200).json("Fichier bien supprimé");
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email: email });

        if (!account) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        account.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(400).json({ error: "Email and password are invalid" });
            }

            return res.status(200).json({
                id: account.id,
                email: account.email,
                token: account.generateJwt()
            })
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (!emailValidator(email)) {
        return res.status(400).json({ error: "Email is invalid" });
    }

    if (!passwordValidator(password)) {
        return res.status(400).json({ error: "Password is invalid" });
    }

    const exists = await Account.findOne({ email: email });
    if (exists) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const account = new Account({
        email: email,
        password: password,
    });

    try {
        await account.save();

        res.header("Location", getUrl(req, account.id));
        res.status(201).json({ id: account.id, email: account.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createaccount,
    getAll,
    getById,
    updateAccount,
    deleteAccount,
    login,
    register,
};