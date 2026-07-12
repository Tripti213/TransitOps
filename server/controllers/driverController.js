import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const create_driver=async(req,res)=>{
    const session=await mongoose.startSession();

    try{
        const{
            name,
            licenseNumber,
            licenseCategory,
            licenseExpiryDate,
            contactNumber,
            safetyScore,
            email,
            password
        }=req.body;

        if(!name||!licenseNumber||!licenseCategory||!licenseExpiryDate||!contactNumber||!email||!password){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        const driver_exists=await Driver.findOne({licenseNumber});

        if(driver_exists){
            return res.status(409).json({
                success:false,
                message:"Driver already exists."
            });
        }
        if(new Date(licenseExpiryDate)<new Date()){
    return res.status(400).json({
        success:false,
        message:"License has already expired."
    });
}

        const user_exists=await User.findOne({email:email.toLowerCase()});

        if(user_exists){
            return res.status(409).json({
                success:false,
                message:"A user with this email already exists."
            });
        }

        const driver_role=await Role.findOne({name:"Driver"});

        if(!driver_role){
            return res.status(500).json({
                success:false,
                message:"Driver role is not configured. Run the seed script first."
            });
        }

        let driver;

        await session.withTransaction(async()=>{
            const hashedPassword=await bcrypt.hash(password,10);

            const [newUser]=await User.create(
                [{
                    name,
                    email:email.toLowerCase(),
                    password:hashedPassword,
                    role:driver_role._id,
                    phone:contactNumber
                }],
                {session}
            );

            const [newDriver]=await Driver.create(
                [{
                    name,
                    licenseNumber,
                    licenseCategory,
                    licenseExpiryDate,
                    contactNumber,
                    safetyScore,
                    user:newUser._id
                }],
                {session}
            );

            driver=newDriver;
        });

        return res.status(201).json({
            success:true,
            message:"Driver registered successfully.",
            driver
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
    finally{
        session.endSession();
    }
};



export const get_drivers=async(req,res)=>{
    try{
        const drivers=await Driver.find().sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:drivers.length,
            drivers
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_driver=async(req,res)=>{
    try{
        const driver=await Driver.findById(req.params.id);

        if(!driver){
            return res.status(404).json({
                success:false,
                message:"Driver not found."
            });
        }

        return res.status(200).json({
            success:true,
            driver
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const update_driver=async(req,res)=>{
    try{
        const driver=await Driver.findById(req.params.id);

        if(!driver){
            return res.status(404).json({
                success:false,
                message:"Driver not found."
            });
        }
        if(driver.status==="Suspended"){
    return res.status(400).json({
        success:false,
        message:"Suspended drivers cannot be updated."
    });
}

        if(req.body.licenseNumber){
            const exists=await Driver.findOne({
                licenseNumber:req.body.licenseNumber,
                _id:{$ne:req.params.id}
            });

            if(exists){
                return res.status(409).json({
                    success:false,
                    message:"License number already exists."
                });
            }
        }

        if(driver.status==="On Trip"){
            return res.status(400).json({
                success:false,
                message:"Driver is currently on a trip."
            });
        }

        driver.name=req.body.name??driver.name;
        driver.licenseNumber=req.body.licenseNumber??driver.licenseNumber;
        driver.licenseCategory=req.body.licenseCategory??driver.licenseCategory;
        driver.licenseExpiryDate=req.body.licenseExpiryDate??driver.licenseExpiryDate;
        driver.contactNumber=req.body.contactNumber??driver.contactNumber;
        driver.safetyScore=req.body.safetyScore??driver.safetyScore;
        // driver.status=req.body.status??driver.status;

        await driver.save();

        return res.status(200).json({
            success:true,
            message:"Driver updated successfully.",
            driver
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const suspend_driver=async(req,res)=>{
    try{
        const driver=await Driver.findById(req.params.id);

        if(!driver){
            return res.status(404).json({
                success:false,
                message:"Driver not found."
            });
        }
        if(driver.status==="Suspended"){
    return res.status(400).json({
        success:false,
        message:"Driver is already suspended."
    });
}

        if(driver.status==="On Trip"){
            return res.status(400).json({
                success:false,
                message:"Driver is currently on a trip."
            });
        }

        driver.status="Suspended";

        await driver.save();

        if(driver.user){
            await User.findByIdAndUpdate(driver.user,{isActive:false});
        }

        return res.status(200).json({
            success:true,
            message:"Driver suspended successfully.",
            driver
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};