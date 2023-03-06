const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
    "/callback",
    passport.authenticate("google", { 
        successRedirect: "/auth/google/callback/success",
        failureRedirect: "/auth/google/callback/failure" 
    }),
);

router.get("/callback/success", async (req, res) => {
    if(!req.user) {
        res.redirect("/auth/google/callback/failure");
    }
    let account;

    try{
        account = await Account.findOne({email: req.user.email});
        if(account){
            return res.status(200).json({
                token: account.generateJWT(),
            })
        }

        account = new Account({
            email: req.user.email,
            proviler: "google",
        });

        await account.save();

        return res.status(201).json({
            id: account.id,
            email: account.email,
            provider: account.provider,
            token: account.generateJWT(),
        })

    }catch(err){
        res.status(500).json({msg: err.message});
    }
});

router.get("/callback/failure", (req, res) => {
    res.send("failure");
});

module.exports = router;