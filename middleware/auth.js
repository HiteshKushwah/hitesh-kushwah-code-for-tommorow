import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    const  token = req.header('Authorization')?.replace('Bearer','');
    

    if(!token){
        return res.status(401).json({message: 'no token, authorization denied'});

    }

    try{
        const decoded = jwt.verify(token, process.env.JWT.SECRET);
        req.user = decoded;
        next();
    } catch (error){
        res.status(401).json({message:'invalid token'});

    
    }
};
export default auth;
