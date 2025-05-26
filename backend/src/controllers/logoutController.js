const logoutController = {};

logoutController.logout = async (req, res)=>{
    //limpiar las cookis, con esto se va borrar el token
    res.clearCookie("authToken");
    
    return res.json({message: "session closed"});
}

export default logoutController; 