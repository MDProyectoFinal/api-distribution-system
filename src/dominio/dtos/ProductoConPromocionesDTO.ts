import { Producto } from "modelos/producto";
import { IPromocion } from "modelos/promocion";

interface ProductoConPromocionesDTO {
    producto: Producto;
    promociones: IPromocion;
  }


  function crearProductoConPromocionesDTO(
    producto: Producto,
    promociones: IPromocion
  ): ProductoConPromocionesDTO {
    return {
      producto,
      promociones
    };
  }