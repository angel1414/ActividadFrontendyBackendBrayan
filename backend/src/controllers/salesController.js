import salesModel from "../models/sales.js";

//Array de funciones
const salesController = {};

//Ventas por categoria
salesController.salesByCategory = async(req, res) => {
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        __id:"$category",
                        totalVentas: {$sum: "$total"}
                    }
                },

                //ordenar
                {
                    $sort: {totalVentas: -1}
                }
            ]
        )

        res.status(200).json(resultado)
        
    } catch (error) {
        console.log("error"+ error)
        res.status(500).json({message: "Internal server error"})
    }
}


salesController.bestSellingProducts = async (req, res) => {
    const resultado = await salesModel.aggregate(
        [
            {
                $group:{
                    _id:{_id: "$product"},
                    cantidad: {$sum: 1}
                }
            },

            //ordenar
            {
                $sort: {cantiddad: -1}
            },

            //limitar la cantidad de datos a mostrar
            {
                $limit: 5
            }
        ]
    )

    res.status(200).json(resultado)
}


salesController.frecuentCustomer = async (req, res)=>{
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group:{
                        _id: "$customer",
                        compras:{$sum: 1}
                    }    
                },
                //ordenar
                {
                    $sort: {compras: -1}
                },

                //limite de 3
                {
                    $limit:3
                }
            ]
        )

        res.status(200).json(resultado)
    } catch (error) {
        console.log("error"+ error)
        res.status(500).json({message:"Internal server error"})
    }
}

salesController.totalEarnings = async (res,rep)=>{
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        gananciasTotales: {$sum:"$total"}
                    }
                }
            ]
        )
        res.status(200).json(resultado)
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
}

salesController.insertSales = async(req, res)=>{
    try {
        const {product, category, customer, total, date} = req.body;

        const newSale = new salesModel(req.body);

        await newSale.save()

        res.status(200).json({message: "Sale saved"})

    } catch (error) {
        console.log("error"+ error)
        res.status(500).json({message: "Internal server error"})
    }
}

salesController.getSales = async (req, res) => {
  try {
    const ventas = await salesModel.find();
    res.status(200).json(ventas);
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default salesController;