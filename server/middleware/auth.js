export const protect = (req,res,next)=>{
 req.user = { role: req.headers.role || "user" };
 next();
};