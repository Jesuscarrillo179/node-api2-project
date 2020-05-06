const router = require('express').Router()

const Db = require('../data/db')

router.post('/', (req, res) => {
    const post = req.body
    if (!post.title || !post.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Db.insert(post)
        .then(({id}) => {
            Db.findById(id)
            .then(([post]) => {
                res.status(201).json(post)
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
})

router.post("/:id/comments", (req, res) => {
    const text = req.body.text
    const post_id = req.params.id

    if(!text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }  else {
        Db.insertComment({text, post_id})
        .then(({id}) => {
            Db.findCommentById(id)
            .then(([comment]) => {
                if(comment){
                    res.status(201).json(comment)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
    }
})

router.get('/', (req, res) => {
    Db.find()
    .then(db => {
        res.status(201).json(db)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    Db.findById(id)
    .then(db => {
        if(db.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
        res.status(201).json(db)
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id

    Db.findPostComments(id)
    .then(db => {
        if(db.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
        res.status(201).json(db)
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    console.log(id)
    Db.remove(id).then(db => {
        if(db === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            Db.find().then(db => {
                res.status(201).json(db)
            })
        }
    }).catch()
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const post = req.body

    if(!post.title || !post.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Db.update(id, post).then(db => {
            if(db === 0){
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                Db.find().then(db => {
                    res.status(200).json(db)
                })
            }
        }).catch(error => {
            console.log(error)
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
})

module.exports = router;