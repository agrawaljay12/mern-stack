import user from '../models/user.js';
import bcrypt from "bcrypt";
import {create_token,refresh_token} from "../middleware/auth.js"


// get all users
const handleGetAllUsers = async (req, res) => {
    try {
        const users = await user.find({});

        return res.status(200).json({
            message:"all users fetched",
            data:users
        });

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
// delete user by id
const handleDeleteUserById = async(req,res) =>{
    try{
        const id = req.params.id;

        if (!id){
            return res.status(400).json({error:"User Id is required"});
        }
        const existuser = await user.findOne({"_id":id});

        if(!existuser){
           return res.status(400).json({error:"User is not found"});
        }

        const result  = await user.findByIdAndDelete(id);

        return res.json({
            message: "User deleted successfully", 
            data:result
        });
    }
    catch (error) {
        return res.status(500).json({message:error.message});
    }
}
// create user 
const handleCreateUser = async (req,res)=>{   
    try{

        const body = req.body;

        // validation to all required field
        if(!body.name || !body.email || !body.age || !body.password){
            return res.status(400).json({error: "all fields are required"});
        }   

        // check the already email exist or not
        const exist_user = await user.findOne({"email":body.email});
        
        // check the user email already exist or not if exist raise error
        if (exist_user){
            return res.status(400).json({error:"Email already exist please try new one"})
        } 

        // store the plain password in password hashing
        const hash_password = await bcrypt.hash(body.password,10);

        const result = await user.create({
            name: body.name,
            email: body.email,
            age: body.age,
            password:hash_password,
            role:"user"
    
        });
        return res.status(201).json({
            message:"User created successfully",
            data:result
        }); 
    }
    catch(error){
        return res.status(500).json({message:error.message});

    }
}

// -----------------handle login-------------------------
const handlelogin = async (req,res)=>{
    try{
        // get the data from request body
        const {email, password} = req.body;

        // validate email & password field
        if(!email || !password){
            return res.status(400).json({error:"all field are required"});
        }

        // check the exist user or not  
        const existuser = await user.findOne({"email":email});

        // if user is not found
        if(!existuser){
            return res.status(404).json({error:"User not found"});
        }

        // compare plain password, hash password
        const hash_password = await bcrypt.compare(password, existuser.password);

        // if password is not match then raise Error
        if(!hash_password){
            return res.status(401).json({error:"password is not match with hash password"});
        }
        
        const token_data = {
            id:existuser._id,
            name:existuser.name,
            email:existuser.email,
            role:existuser.role
        }

        // generate and refresh the token 
        const access_token = create_token(token_data);
        // const token = refresh_token(token_data);

        // // store the refresh Token
        // token_data.push(token);
        // await token_data.save();
        
        // return the payload token
        return res.status(200).json({
            message:"user logged in",
            data:{
              access_token:access_token,
              result:token_data,
              token_type:"Bearer"
            } 
        });

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

// update user by id
const handleUpdateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }

    const existuser = await user.findById(id);

    if (!existuser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const result = await user.findByIdAndUpdate(
      id,
      {
        name: body.name,
        email: body.email,
        age: body.age,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      return res.status(400).json({
        error: "No data is updated",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// get particular user by id
const handleGetUserById = async (req,res) =>{
    try{
        const id = req.params.id;

        if(!id){
             return res.status(400).json({error:"User Id is required"});
        }

        const result  = await user.findById({_id:id}); 

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            message:"user is fetched",
            data:result
        });
    }
    catch (error) {
        return res.status(500).json({message:error.message});
    }   
}

 const forgot_password = async (req,res)=>{
      try{
            const {email,password,confirm_password} = req.body;

            if(!email || !password || !confirm_password){
                return res.status(400).json({"error":"all fields are required"});
            }

            const existuser = await user.findOne({"email":email});

            if(!existuser){
                return res.status(404).json({error:"User not found"});
            }       
            
            if(!password === !confirm_password){
                return res.status(400).json({error:"password and confirm password is not match"});
            }

            const hash_password = await bcrypt.hash(password,10);

            result =  await user.findByIdAndUpdate(email,{password:hash_password});  

            if(!result){
                return res.status(400).json({"error":"Password is not changed"})
            }

            return res.status(200).json({"error":"password is updated"})

      }
      catch(error){
        return res.status(500).json({message:error.message});
      }  
 }

 const handleChangePassword =
  async (req, res) => {
    try {
      /*
       * req.user comes from verifytoken.
       *
       * Your JWT contains:
       *
       * {
       *   id,
       *   name,
       *   email,
       *   age,
       *   role
       * }
       */

      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      /*
       * Get user with password.
       */

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      /*
       * Check current password.
       */

      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatches) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      /*
       * Don't allow same password.
       */

      const samePassword =
        await bcrypt.compare(
          newPassword,
          user.password
        );

      if (samePassword) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be different from your current password",
        });
      }

      /*
       * Hash new password.
       */

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      /*
       * Save password.
       */

      user.password =
        hashedPassword;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
        data: null,
      });
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };
export{handleGetAllUsers ,handleDeleteUserById,handleCreateUser ,handleUpdateUserById,handleGetUserById, handlelogin,handleChangePassword};