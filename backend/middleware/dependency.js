import { error } from "console";

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
export default get_required_roles;