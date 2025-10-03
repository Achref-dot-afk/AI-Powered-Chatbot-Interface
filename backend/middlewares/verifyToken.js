const jwt = require('jsonwebtoken');

//verify token for logging

function verifyToken(req,res,next){
    const authToken=req.headers.authorization;
    if(authToken){
        const token=authToken.split(" ")[1];
        try{
            const decodedPeyload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decodedPeyload;  
            next();
        }catch(err){
            res.status(401).send("invalid token, Access denied");
        }
    }else{
        res.status(401).send("Token not provided, Access denied");
    }
}



module.exports={verifyToken};