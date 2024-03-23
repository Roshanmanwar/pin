const multer = require("multer");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const { post } = require("../routes/routes");


const BasicController = {

    profile(req, res) {
        const user = req.session.user;
        try {
            if (req.session.msg === "success") {
                return res.render('profile', { user });

            } else {
                res.redirect('/login');
            }
        } catch (error) {
            res.status(404).json({
                msg: "something went wrong"
            })
        }
    },



    async feed(req, res) {
        const posts = await postModel.find();
        res.render('feed', { posts: posts })
    },


    register(req, res) {
        res.render('register')
    },

    async saveUser(req, res) {
        let data = req.body;
        try {
            let NewUser = await new userModel({
                userName: data.userName,
                password: data.password,
                email: data.email,
                fullName: data.fullName
            });
            let SaveNewUser = await NewUser.save();
            if (SaveNewUser) {
                res.redirect('/login')
            }
            else {
                res.send('fail to Register')
            }
        } catch (error) {
            res.send('Email and UserName Must be Unique')
        }
    },

    login(req, res) {
        let msg = req.session.msg !== undefined ? req.session.msg : "";
        delete req.session.msg;
        res.render('login', { msg: msg });
    },

    async checkLogin(req, res) {
        let data = req.body;
        try {
            let isUserExists = await userModel.findOne({
                email: data.email,
                password: data.password
            }).populate("posts");

            if (isUserExists) {
                req.session.msg = "success"
                req.session.user = isUserExists;
                res.redirect('/');
            }
            else {
                req.session.msg = "Incorrect Email & Password"
                res.redirect('/login');
            }
        } catch (error) {
            req.status(404).json({
                msg: "something went wrong"
            })
        }
    },

    logOut(req, res) {
        req.session.destroy();
        res.redirect('/login')
    },


    //for upload a file through multer
    async upload(req, res) {
        try {
            if (!req.file) {
                res.send('not upload')
            }
            else {
                const user = await req.session.user;
                const isUserExists = await userModel.findOne({
                    userName: user.userName,
                }).populate("posts");
                // let data = req.file.filename;// file url get
                const newPost = await new postModel({
                    postText: req.body.postText,
                    image: req.file.filename,
                    user: isUserExists._id,
                });
                const savePost = await newPost.save();
                isUserExists.posts.push(savePost._id);
                await isUserExists.save();
                const users = await userModel.findOne({
                    email: user.email,
                }).populate("posts");
                req.session.user.posts = users.posts;
                res.redirect('/')
            }
        } catch (error) {
            req.status(404).json({
                msg: "someting went wrong"
            })
        }
    },


    async deletePost(req, res) {
        try {
            const findPost = await postModel.findOneAndDelete({
                _id: req.params.id,
            });
            await userModel.updateOne(
                { _id: findPost.user },
                { $pull: { posts: findPost._id } } // Remove the post ID from the posts array
            );
            const userFind = await userModel.findOne({
                _id: findPost.user
            }).populate("posts");
            req.session.user.posts = userFind.posts;
            res.redirect('/')
        } catch (error) {
            req.status(404).status({
                msg: "Something went wrong"
            })
        }
    },


    async changeProfile(req, res) {
        // let data = req.file.filename;// file url get
        try {
            let user = req.session.user;
            const findUser = await userModel.findOne({
                email: user.email
            }).populate("posts");
            findUser.dp = req.file.filename;
            await findUser.save();
            req.session.user = findUser;
            res.redirect('/');
        } catch (error) {
            req.status(404).json({
                msg: "something went wrong"
            })
        }
    },

    async likes(req, res) {
        try {
            const postId = req.params.like;
            const userId = req.session.user._id; // Assuming user ID is stored in session
            // Find the post by ID
            const findPost = await postModel.findById(postId);
            // Check if the user has already liked the post
            if (findPost.likes.includes(userId)) {
                return res.redirect('/feed');
            }
            // Push the user ID to the likes array
            findPost.likes.push(userId);
            // Save the updated post
            await findPost.save();
            // Update the user's session with the updated post data
            const findUser = await userModel.findOne({ _id: userId }).populate("posts");
            req.session.user = findUser;
           // Redirect to feed page
            res.redirect('/feed');
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
    }

};




module.exports = BasicController;
