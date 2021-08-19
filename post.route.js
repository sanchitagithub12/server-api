const express = require('express');
const postRoutes = express.Router();
// Require Post model in our routes module
let Post = require('./post.model');
// Defined store route
postRoutes.route('/add').post(function (req, res) {
    let post = new Post(req.body);
    post.save()
        .then(() => {
            res.status(200).json({ 'business': 'business in added successfully' });
        })
        .catch(() => {
            res.status(400).send("unable to save to database");
        });
});
// Defined get data(index or listing) route
/*postRoutes.route('/').get(function (req, res) {
    Post.find(function (err, posts) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(posts);
        }
    });
});*/


/*postRoutes.route('/').get(function (req, res) {
    Post.find(function (err, posts) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(posts);
        }
    });
});*/

/*postRoutes.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (error) {
        res.sendStatus(500).send(error.message);
    }
});*/
/*postRoutes.route('/').get(function (req, res, next) {
    try {
        let { page, size } = req.query;
        if (!page) {
            page = 1
        }
        if (!size) {
            size = 10
        }
        const limit = parseInt(size);
        //const skip = (page - 1) * size;

        //const posts=await URLSearchParams.findById({},{},{limit:limit,skip:skip})
        const posts = await Post.find().limit(limit).skip(skip)
        res.send(posts);
    }
    catch (error) {
        res.sendStatus(500).send(error.message);
    }
})*/

postRoutes.get("/", async (req, res, next) => {
    try {
        let { page, size, sort } = req.query;
        if (!page) {
            page = 1;

        }
        if (!size) {
            size = 10;

        }

        const limit = parseInt(size);
        const skipIndex = (page - 1) * limit;
        const posts = await Post.find().sort(
            { _id: 1 }
        ).limit(limit)
            .skip(skipIndex)
        res.send({ page, size, Info: posts });
        //res.json(posts)
    }
    catch (error) {
        res.sendStatus(500);
    }
})
/*postRoutes.get("/", paginatedResults(), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults() {
    return async (req, res, next) => {

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const results = {};

        try {
            results.results = await Post.find()
                .sort({ _id: 1 })
                .limit(limit)
                .skip(skipIndex)
                .exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: "Error Occured" });
        }
    };
}*/
// Defined edit route
postRoutes.route('/edit/:id').get(function (req, res) {
    let id = req.params.id;
    Post.findById(id, function (err, post) {
        if (err) {
            res.json(err);
        }
        res.json(post);
    });
});
//  Defined update route
postRoutes.route('/update/:id').post(function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (!post)
            res.status(404).send("data is not found");
        else {
            post.name = req.body.name;
            post.email = req.body.email;
            post.phone = req.body.phone;
            post.save().then(() => {
                res.json('Update complete');
            })
                .catch(() => {
                    res.status(400).send("unable to update the database");
                });
        }
    });
});
// Defined delete | remove | destroy route
postRoutes.route('/delete/:id').delete(function (req, res) {
    Post.findByIdAndRemove({ _id: req.params.id }, function (err) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
});
module.exports = postRoutes;