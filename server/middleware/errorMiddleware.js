export const not_found=(req,res,next)=>{
    const err=new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(err);
};

export const error_handler=(err,req,res,next)=>{
    const status=res.statusCode===200?500:res.statusCode;

    res.status(status).json({
        success:false,
        message:err.message||"Internal Server Error"
    });
};