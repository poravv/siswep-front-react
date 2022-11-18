import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import BuscadorDato from "../Buscador/Buscador";
import '../../CSS/Buscador.css'

const URI = 'http://186.158.152.141:3001/sisweb/api/producto/'
const URIPROVEEDOR = 'http://186.158.152.141:3001/sisweb/api/proveedor/'
let fechaActual = new Date();

const CrearProductos = ({ token, idusuario }) => {

  const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState(0);
  // eslint-disable-next-line
  const [peso, setPeso] = useState(0);
  // eslint-disable-next-line
  const [img, setImg] = useState('');
  const navigate = useNavigate();

  //Buscador
  const [proveedorSeleccionado, setproveedorSeleccionado] = useState(null);
  const [valueProd, setValueProd] = useState("");



  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  };

  //procedimiento para actualizar
  const create = async (e) => {
    e.preventDefault();
    await axios.post(URI + "post/", {
      idproducto: 0,
      descripcion: descripcion,
      precio: precio,
      peso: peso,
      estado: "AC",
      fecha_insert: strFecha,
      idusuario_upd: idusuario,
      //img:img,
      idproveedor: proveedorSeleccionado.idproveedor
    }, config
    );
    navigate('/productos')
  }


  const btnCancelar = (e) => {
    e.preventDefault();
    navigate('/productos');
  }

  return (
    <div className="cuerpo">
      <form onSubmit={create} >
      <div style={{ margin:`20px` }}>
                <h2>Nuevo articulo</h2>
            </div>
        <div className="mb-3">
          <label className="form-label">descripcion</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Buscador</label>
          <BuscadorDato setDatoSeleccionado={setproveedorSeleccionado} uri={URIPROVEEDOR + "get/"} config={config} campo={'Articulo'} setValue={setValueProd} value={valueProd} />
        </div>
        <div style={{ margin: `30px` }}>
          <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Agregar</button>
          <button style={{ margin: `10px` }} onClick={btnCancelar}
            className="btn btn-primary">Cancelar</button>
        </div>
      </form>
    </div>
  )

}

export default CrearProductos