import UserModel from "../models/UserModel.js";
import argon2 from "argon2";
import { authMessage as msg } from "../constant/Message.js";

export const getUsers = async(req, res) => {
    try {
        const response = await UserModel.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const getUserById = async(req, res) => {
    try {
        const response = await UserModel.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const createUser = async(req, res) => {
    const {name, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: msg.registerPassConfFail});
    const hashPassword = await argon2.hash(password);
    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hashPassword,
            role: (role || 0)
        });
        res.status(200).json({msg: msg.registerSuccess});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const updateUser = async(req, res) => {
    const user = await UserModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(400).json({msg: msg.userNotFound});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.json({msg: msg.registerPassConfFail});
    try {
        await UserModel.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: msg.userUpdateSuccess});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const deleteUser = async(req, res) => {
    const user = await UserModel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.json({msg: msg.userNotFound});
    try {
        await UserModel.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: msg.userDeleteSuccess});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}