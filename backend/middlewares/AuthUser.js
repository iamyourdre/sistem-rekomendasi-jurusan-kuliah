import UserModel from "../models/UserModel.js";
import { authMessage as msg } from "../constant/Message.js";

export const verifyUser = async (req, res, next) =>{
    if(!req.session.userId){
        return res.status(403).json({msg: msg.loginRequired});
    }
    const user = await UserModel.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(403).json({msg: msg.loginFailed});
    req.userId = user.id;
    req.role = user.role;
    next();
}

export const adminOnly = async (req, res, next) =>{
    const user = await UserModel.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(403).json({msg: msg.loginFailed});
    if(user.role !== 1) return res.status(403).json({msg: msg.accessDenied});
    next();
}