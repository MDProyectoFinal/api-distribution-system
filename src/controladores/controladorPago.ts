import express from 'express'
import axios from 'axios';

// const mercadopago = require('mercadopago');

export const crearPreferenciaPago = async (req: express.Request, res: express.Response) => {
    
    const { payer_email, items } = req.body;

    const url = 'https://api.mercadopago.com/checkout/preferences';

    // Define la preferencia de pago
    const preference = {
        payer_email: payer_email, // 'test_user_63594283@testuser.com', Mail del Comprador       
        items: items,
        
        // TEST -> Para UN producto
        // items: [
        //     {
        //         //id: id,
        //         // currency_id: currency_id,
        //         title, // Nombre del producto
        //         quantity, // Cantidad
        //         unit_price: price, // Precio por unidad  
        //         description: description,
        //         picture_url: picture_url,
        //         category_id: category_id   
        //     },
        // ],
        back_urls: {
            success: 'http://localhost:4200/client/pago-success', // 'http://localhost:4200/payment-success',
            failure: 'http://localhost:4200/client/pago-failure', //'http://localhost:4200/payment-failure',
            pending: 'http://localhost:4200/client/pago-pending', //'http://localhost:4200/payment-pending',
        },
        auto_return: 'approved', // Redirección automática al aprobar el pago
    };
    
    // Configurar los headers (incluye tu Access Token de Mercado Pago)
    // TODO: Ver si usamos el "process.env.MP_ACCESS_TOKEN" o el "Headers" recibido del FRONT
    const headers = {
        'Content-Type': req.headers['content-type'], // 'application/json',
        Authorization: req.headers.authorization // `Bearer ${process.env.MP_ACCESS_TOKEN}`, // Access Token
    };
    
    try {    
        // NUEVO: Realizar la solicitud POST a la API de Mercado Pago
        const response = await axios.post(url, preference, { headers });

        // Enviar la respuesta con el ID de preferencia y otros datos útiles
        res.status(200).json({
            data: response.data
            // id: response.data.id,
            // init_point: response.data.init_point, // URL para redirigir al checkout
            // sandbox_init_point: response.data.sandbox_init_point, // URL de prueba
        });

    } catch (error: any) {        
        console.error('Error al crear preferencia:', error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data || 'No se pudo crear la preferencia de pago',
        });
    }

}