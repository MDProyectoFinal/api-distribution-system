import mongoose, { Types } from 'mongoose'
import { Schema, Document } from 'mongoose'

export interface IPedidoFiltro {
  idPedido?: number; // Id personalizado del pedido, par auna busqueda mas amigable
  cliente?: string; // Es el ObjectId del usuario (cliente)
  estado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface Pedido extends Document {
  idPedido: number // Es el ID Personalizado para lograr mas amigabilidad con los pedidos
  fechaAlta: Date
  estado: string
  cliente: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Nombre del modelo de usuarios (clientes)
    required: true
  }
  items: Types.DocumentArray<ItemPedido>
  subtotal: number
  pagado:boolean
}

export interface ItemPedido extends Document {
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto', // Nombre del modelo de productos
    required: true
  }
  cantidad: number
  precio: number
  precioUnitario : number,
  precioPromocional : number,
  total: number // El total es facilmente calculado, no hace falta açá. Guardarlo puede generar incosistencias
}

let PedidoItemSchema = new mongoose.Schema(
  {
    idProducto: { type: Schema.ObjectId, required: true, ref: 'Producto', unique: false},
    cantidad: { type: Number, required: true, min: [1, 'La cantidad no puede ser menor a 1'] },
    precio: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    precioPromocional: { type: Number, required: false }, // No estoy seguro guardarlo en este punto u obtenerlo de un histórico de precioes
    total: { type: Number, required: true }, // No estoy seguro de guardar esto porque es un atributo calculado
  },
)

const pedidoSchema = new mongoose.Schema<Pedido>(
  {
    idPedido: { type: Number, required: true, unique: true },
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
    pagado: {
      type: Boolean,
      default: false
    },
  },

)

pedidoSchema.pre('validate', async function(next) {
  const pedido = this;
  if (!pedido.idPedido) {
    const ultimoPedido = await PedidoModel.findOne().sort({ idPedido: -1 });
    if (ultimoPedido) {
      pedido.idPedido = ultimoPedido.idPedido + 1;
    } else {
      pedido.idPedido = 1;
    }
  }

  pedido.estado = 'PENDIENTE'

  next();
});

export const PedidoModel = mongoose.model<Pedido>('Pedido', pedidoSchema)
