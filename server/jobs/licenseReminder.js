import cron from "node-cron";
import Driver from "../models/Driver.js";
import { send_sms } from "../utils/sendSMS.js";

cron.schedule("0 9 * * *", async ()=>{

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

            `TransitOps: Your driving license expires on ${driver.licenseExpiryDate.toDateString()}. Please renew it.`

        );

    }

});