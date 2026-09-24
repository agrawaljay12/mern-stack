import { error } from "console";
import jwt from "jsonwebtoken";

const get_required_roles = (roles=[])=>{
    
   const check_role =(req,res,next)=>{

        try{

            // check user is exist or not
            if(!req.user){
                return res.status(404).json({error:"user is not exist"})
            }

            // check role
            if(roles.includes(req.user.role)){
                next();
            }else{
                return res.status(401).json({error:"Unauthorized to Acess"})
            }

        }catch(error){
            console.log(error);
            return res.status(500).json({error:"Internal Server Error"});
        }
    } 
    return check_role;
}

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      const token = authHeader.split(" ")[1];

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      req.user = decodedToken;
    }

    next();
  } catch (error) {
    // Invalid JWT means treat request as guest
    next();
  }
};
export {get_required_roles,optionalAuth};