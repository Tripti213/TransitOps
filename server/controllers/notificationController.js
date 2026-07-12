import Driver from "../models/Driver.js";
import { send_sms } from "../utils/sendSMS.js";
export const send_license_reminders=async(req,res)=>{

    const today=new Date();

    const next30=new Date();

    next30.setDate(today.getDate()+30);

    const drivers=await Driver.find({
        licenseExpiryDate:{
            $gte:today,
            $lte:next30
        }
    });

    for(const driver of drivers){

        await send_sms(
            driver.contactNumber,
            `TransitOps: Your driving license expires on ${driver.licenseExpiryDate.toDateString()}.`
        );

    }

    res.json({
        success:true,
        message:"SMS reminders sent."
    });

};