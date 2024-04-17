import mongoose, { Types } from 'mongoose'
import { Schema, Document } from 'mongoose'

export interface Pedido extends Document {
  fechaAlta: Date
  estado: string
  cliente: typeof Schema.ObjectId
  items: Types.DocumentArray<ItemPedido>
  subtotal: number
}

export interface ItemPedido extends Document {
  idProducto: typeof Schema.ObjectId
  cantidad: number
  precio: number
  total: number
}

let PedidoItemSchema = new mongoose.Schema({
  idProducto: { type: Schema.ObjectId, required: true, ref: 'Producto' },
  cantidad: { type: Number, required: true, min: [1, 'La cantidad no puede ser menor a 1'] },
  precio: { type: Number, required: true }, // No estoy seguro guardarlo en este punto u obtenerlo de un histórico de precioes
  total: { type: Number, required: true }, // No estoy seguro de guardar esto porque es un atributo calculado
})

const pedidoSchema = new mongoose.Schema<Pedido>(
  {
    fechaAlta: { type: Date, required: true, default: new Date() },
    estado: { type: String, required: true },
    cliente: { type: Schema.ObjectId, required: true, ref: 'Cliente' },
    items: [PedidoItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  {
    methods: {
      calcularSubtotal() {
        let sum = 0
        this.items
          .map((i: ItemPedido) => i.total)
          .forEach((valor: number) => {
            console.log(sum)
            console.log(valor)

            sum + valor
          })

        return sum
      },
    },
  }
)

export const PedidoModel = mongoose.model<Pedido>('Pedido', pedidoSchema)
