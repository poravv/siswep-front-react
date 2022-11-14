import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import Autosuggest from 'react-autosuggest';
import '../../CSS/Buscador.css'

const URI = 'http://186.158.152.141:3001/sisweb/api/producto/'
const URIPROVEEDOR = 'http://186.158.152.141:3001/sisweb/api/proveedor/'
let fechaActual = new Date();

const CrearProductos = ({ token, idusuario }) => {
  //console.log(token);
  //console.log(idusuario);

  const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState(0);
  // eslint-disable-next-line
  const [peso, setPeso] = useState(0);
  // eslint-disable-next-line
  const [img, setImg] = useState('');
  const navigate = useNavigate();



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


  /**********************************************************/
  /**************************Buscador************************/
  /**********************************************************/

  const [proveedor, setproveedor] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState([]);
  const [value, setValue] = useState("");
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState({});


  const getProveedores = async () => {
    const res = await axios.get(URIPROVEEDOR + "get/", config);
    setproveedor(res.data.body);
    setFiltroProveedor(res.data.body);
  }

  useEffect(() => {
    getProveedores()
    // eslint-disable-next-line
  }, [])

  const onSuggestionsFetchRequested = ({ value }) => {
    setproveedor(filtrarproveedor(value));
  }

  const filtrarproveedor = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // eslint-disable-next-line 
    var filtrado = filtroProveedor.filter((proveedor) => {
      var textoCompleto = proveedor.razon_social + " - " + proveedor.estado;

      if (textoCompleto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(inputValue)) {
        return proveedor;
      }
    });

    return inputLength === 0 ? [] : filtrado;
  }

  const onSuggestionsClearRequested = () => {
    setproveedor([]);
  }

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.razon_social} - ${suggestion.estado}`;
  }

  const renderSuggestion = (suggestion) => (
    <div className='sugerencia' onClick={() => seleccionarproveedor(suggestion)}>
      {`${suggestion.razon_social} - ${suggestion.estado}`}
    </div>
  );

  const seleccionarproveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
  }

  const onChange = (e, { newValue }) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: "Seleccione proveedor",
    value,
    onChange
  };

  const eventEnter = (e) => {
    // eslint-disable-next-line 
    if (e.key == "Enter") {
      var split = e.target.value.split('-');
      var proveedor = {
        proveedor: split[0].trim(),
        pais: split[1].trim(),
      };
      seleccionarproveedor(proveedor);
    }
  }

  /**********************************************************/
  /***********************Fin Buscador***********************/
  /**********************************************************/

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
          <Autosuggest className="form-label"
            suggestions={proveedor} onSuggestionsFetchRequested={onSuggestionsFetchRequested} onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue} renderSuggestion={renderSuggestion} inputProps={inputProps} onSuggestionSelected={eventEnter} />
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