import Users from "../models/UserModel.js";
import argon2 from "argon2";
import { authMessage as msg } from "../constant/Message.js";

export const Me = async (req, res) =>{
  try {
    if(!req.session.userId){
        return res.status(403).json({msg: msg.loginRequired});
    }
    const user = await Users.findOne({
        attributes: ['uuid','name','email','role'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(400).json({msg: msg.loginFailed});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const Login = async (req, res) =>{
    try {
        const userMatch = await Users.findOne({where: {email: req.body.email}});
        if(!userMatch) return res.status(400).json({msg: msg.loginFailed});
        const passMatch = await argon2.verify(userMatch.password, req.body.password);
        if(!passMatch) return res.status(400).json({msg: msg.loginFailed});
        req.session.userId = userMatch.uuid;
        const uuid = userMatch.uuid;
        const name = userMatch.name;
        const email = userMatch.email;
        const role = userMatch.role;
        res.status(200).json({uuid, name, email, role});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const Logout = (req, res) =>{
    try {
        req.session.destroy((err)=>{
            if(err) return res.status(400).json({msg: msg.other});
            res.status(200).json({msg: msg.logoutSuccess});
        })
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}