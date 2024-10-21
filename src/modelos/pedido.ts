import mongoose, { Types } from 'mongoose'
import { Schema, Document } from 'mongoose'

export interface IPedidoFiltro {
  idPedido?: string; // Id personalizado del pedido, par auna busqueda mas amigable
  cliente?: string; // Es el ObjectId del usuario (cliente)
  estado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface Pedido extends Document {
  idPedido: string // Es el ID Personalizado para lograr mas amigabilidad con los pedidos
  fechaAlta: Date
  estado: string
  cliente: { 
    type:  mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', // Nombre del modelo de usuarios (clientes)
    required: true 
  }
  items: Types.DocumentArray<ItemPedido>
  subtotal: number
}

export interface ItemPedido extends Document {
  idProducto: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', // Nombre del modelo de productos
    required: true
  }
  cantidad: number
  precio: number
  total: number // El total es facilmente calculado, no hace falta açá. Guardarlo puede generar incosistencias
}

let PedidoItemSchema = new mongoose.Schema(
  {
    idProducto: { type: Schema.ObjectId, required: true, ref: 'Producto', unique: true },
    cantidad: { type: Number, required: true, min: [1, 'La cantidad no puede ser menor a 1'] },
    precio: { type: Number, required: true }, // No estoy seguro guardarlo en este punto u obtenerlo de un histórico de precioes
    total: { type: Number, required: true }, // No estoy seguro de guardar esto porque es un atributo calculado
  },
  // {
  //   methods: {
  //     // Reemplazaría el "total"
  //     getTotalCalc() {
  //       return this.cantidad + this.precio;
  //     }
  //   }
  // }
)

const pedidoSchema = new mongoose.Schema<Pedido>(
  {
    idPedido: { type: String, required: true}, // Id personalizado
    fechaAlta: { type: Date, required: true, default: () => new Date() },
    estado: { type: String, required: true },
    cliente: { 
      type: Schema.ObjectId, 
      required: true, 
      ref: 'Usuario' 
    },
    items: [PedidoItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  // {
  //   methods: {
  //     // Eso se hace si no queremos tener la propiedad "subtotal"
  //     calcularSubtotal() {
  //       return this.items.reduce(( sum: number, item: ItemPedido) => {
  //         return sum + (item.precio * item.cantidad); // total = item.precio * itme.cantidad
  //       }, 0);
  //     },
  //   },
  // }
)

export const PedidoModel = mongoose.model<Pedido>('Pedido', pedidoSchema)
