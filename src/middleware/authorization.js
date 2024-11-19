const adminAuth =(req,res,next)=>{
    const token="xyz34";
    const isAdminAuthorized = token ==="xyz"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized")
    }else{
        next()
    }
}

const userAuth =(req,res,next)=>{
    const token="xyz34";
    const isAdminAuthorized = token ==="xyz"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized")
    }else{
        next()
    }
}

module.exports = {adminAuth,userAuth}