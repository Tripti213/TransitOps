import Expense from "../models/Expense.js";
import Vehicle from "../models/Vehicle.js";

export const get_expenses=async(req,res)=>{
    try{
        const expenses=await Expense.find()
        .populate("vehicle")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:expenses.length,
            expenses
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const get_expense=async(req,res)=>{
    try{
        const expense=await Expense.findById(req.params.id)
        .populate("vehicle");

        if(!expense){
            return res.status(404).json({
                success:false,
                message:"Expense not found."
            });
        }

        return res.status(200).json({
            success:true,
            expense
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


export const create_expense=async(req,res)=>{
    try{
        const{
            vehicle,
            type,
            amount,
            date,
            description
        }=req.body;

        if(!vehicle||!type||!amount||!date){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields."
            });
        }

        if(amount<=0){
            return res.status(400).json({
                success:false,
                message:"Expense amount must be greater than zero."
            });
        }

        const vehicle_doc=await Vehicle.findById(vehicle);

        if(!vehicle_doc){
            return res.status(404).json({
                success:false,
                message:"Vehicle not found."
            });
        }

        if(vehicle_doc.status==="Retired"){
            return res.status(400).json({
                success:false,
                message:"Cannot add expenses for a retired vehicle."
            });
        }

        const expense=await Expense.create({
            vehicle,
            type,
            amount,
            date,
            description
        });

        return res.status(201).json({
            success:true,
            message:"Expense added successfully.",
            expense
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
};