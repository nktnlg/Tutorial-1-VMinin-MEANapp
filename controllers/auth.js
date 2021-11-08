const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function(req,res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        //check password, user exists
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            //generate token, password OK
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60*60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //wrong password
            res.status(401).json({
                message: 'Wrong password, try again'
            })
        }
    } else {
        //no such user, error
        res.status(404).json({
            message: 'User not found'
        })
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //user exists, must return error
        res.status(409).json({
            message: 'User with this email already exists'
        })
    } else {
        //create user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try{
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }

    }
}