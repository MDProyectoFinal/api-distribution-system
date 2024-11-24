import express from 'express'
const mercadopago = require('mercadopago');

export const crearPreferenciaPago = async (req: express.Request, res: express.Response) => {
    
    const { title, quantity, price } = req.body;

    const preference = {
        items: [
        {
            title,      // Nombre del producto
            quantity,   // Cantidad
            unit_price: price, // Precio por unidad
        },
        ],
        back_urls: {
        success: 'http://localhost:4200/payment-success',
        failure: 'http://localhost:4200/payment-failure',
        pending: 'http://localhost:4200/payment-pending',
        },
        auto_return: 'approved',
    };

    try {
        debugger;
        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id }); // Devuelve el ID de preferencia
    } catch (error: any) {
        res.status(500).send(error.message);
    }

}