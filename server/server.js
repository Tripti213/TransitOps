import dotenv from "dotenv";
import app from "./app.js";
import connect_db from "./config/db.js";

dotenv.config();

const port=process.env.PORT||5000;

connect_db()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server running on port ${port}....`);
    });
})
.catch((err)=>{
    console.log(err);
});