import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import Autosuggest from 'react-autosuggest';
import '../../CSS/Buscador.css';
import { IoAddSharp, IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3001/sisweb/api/inventario/';
const URIINVDET = 'http://186.158.152.141:3001/sisweb/api/detinventario/';
const URIPROD = 'http://186.158.152.141:3001/sisweb/api/producto/';



const CrearInventario = ({ token, idsucursal }) => {
  
  const fechaActual = new Date();
  //console.log(token);

  const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
  
  console.log(strFecha);

  const navigate = useNavigate();
  const [tblinventariotmp, setTblInventarioTmp] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [mensaje, setMensaje] = useState(null);

  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  };

  
  const getProductoId = async (idinventario) => {
    return await axios.get(`${URI}getidproducto/${idinventario}-${idsucursal}`, config);
  }
  

  //procedimiento para actualizar
  const gestionGuardado = async (e) => {
    e.preventDefault();

    /*
    1- Armar un loop para recorrer cada registro -ok
    2- Buscar si existe un registro de la cabecera por el producto
    3-Insertar cabecera si no existe y actualizar si es que existe
    */

    tblinventariotmp.map((inventario) => {
      getProductoId(inventario.idproducto).then((value) => {
      try {
        actualizaCab(value.data.body[0].idinventario, {
          idinventario: value.data.body[0].idinventario,
          estado: value.data.body[0].estado,
          //idproducto: value.data.body[0].idproducto,
          //idsucursal: idsucursal,
          cantidad_total: (parseInt(value.data.body[0].cantidad_total) + parseInt(inventario.cantidad)),
          //cantidad_ven: value.data.body[0].cantidad_ven,
        }).then((cabecera) => {
          console.log('El id es: ', cabecera);
          //Guardado del detalle
          guardaDetalle({
            cantidad: inventario.cantidad,
            estado: 'AC',
            idinventario: value.data.body[0].idinventario,
            fecha_insert: strFecha,
            fecha_upd: strFecha,
          });
        });
      } catch (error) {
        console.log(error)
      }
      
  });

//Comentado por motivo de que el inventario ya se inserta al insertar el articulo, luego solo se actualiza
      /*
      getProductoId(inventario.idproducto).then((value) => {

        //console.log(value.data.body.length);

        if (value.data.body.length !== 0) {
          //console.log("Actualiza cabecera",value.data.body[0].idinventario);
          try {
            actualizaCab(value.data.body[0].idinventario, {
              idinventario: value.data.body[0].idinventario,
              estado: value.data.body[0].estado,
              idproducto: value.data.body[0].idproducto,
              idsucursal: idsucursal,
              cantidad_total: (parseInt(value.data.body[0].cantidad_total) + parseInt(inventario.cantidad)),
              cantidad_ven: value.data.body[0].cantidad_ven,
            }).then((cabecera) => {
              console.log('El id es: ', cabecera);

              //Guardado del detalle
              guardaDetalle({
                cantidad: inventario.cantidad,
                estado: 'AC',
                idinventario: value.data.body[0].idinventario,
                fecha_insert: strFecha,
                fecha_upd: strFecha,
              });

            });
          } catch (error) {
            console.log(error)
          }

        } else {
          console.log("Guarda cabecera");
          try {
            guardaCab(
              {
                idsucursal: idsucursal,
                estado: 'AC',
                cantidad_total: (inventario.cantidad),
                cantidad_ven: 0,
                idproducto: inventario.idproducto
              }
            ).then((cabecera) => {
              console.log('El id es: ', cabecera);

              //Guardado del detalle
              guardaDetalle({
                cantidad: inventario.cantidad,
                estado: 'AC',
                idinventario: cabecera.data.body.idinventario,
                fecha_insert: strFecha,
                fecha_upd: strFecha,
              });

            });
          } catch (e) {
            console.log(e);
          }
        }
      });
      */
      return true;
    });
    
  }

  /*
  const guardaCab = async (valores) => {
    //console.log("Entra en guardaCab");
    //Guardado de cabecera
    return await axios.post(URI + "post/", valores, config);
    //console.log(invCabecera);
  }
  */

  const actualizaCab = async (idinventario, valores) => {
    console.log("Entra en actualizaCab");
    return await axios.put(URI + "put/" + idinventario, valores, config);
    //console.log(invCabecera);
  }

  const guardaDetalle = async (valores) => {
    await axios.post(URIINVDET + "post/", valores, config);
    navigate('/inventario');
  }

  const agregarLista = async (e) => {
    e.preventDefault();

    const validExist = tblinventariotmp.filter((inv) => inv.idproducto === productoSeleccionado.idproducto);
    //console.log(productoSeleccionado);

    if (productoSeleccionado !== null) {
      if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
        if (validExist.length === 0) {
          tblinventariotmp.push({
            idproducto: productoSeleccionado.idproducto,
            producto: productoSeleccionado,
            cantidad: cantidad
          });
          setProductoSeleccionado(null);
          setproducto([]);
          setCantidad(0);
          setValue("");

        } else {
          setMensaje('El producto ya existe en la lista')
          setTimeout(() => {
            setMensaje(null)
          }, 5000);
        }
      } else {
        setMensaje('Cargue la cantidad')
        setTimeout(() => {
          setMensaje(null)
        }, 5000);
      }
    } else {
      setMensaje('Selecciona un producto')
      setTimeout(() => {
        setMensaje(null)
      }, 5000);
    }

  }


  /**********************************************************/
  /**************************Buscador************************/
  /**********************************************************/

  const [producto, setproducto] = useState([]);
  const [filtroProducto, setFiltroProducto] = useState([]);
  const [value, setValue] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);


  const getProductos = async () => {
    const res = await axios.get(`${URIPROD}get/`, config);
    setproducto(res.data.body);
    setFiltroProducto(res.data.body);
  }

  useEffect(() => {
    getProductos()
    // eslint-disable-next-line
  }, [])

  const onSuggestionsFetchRequested = ({ value }) => {
    setproducto(filtrarproducto(value));
  }

  const filtrarproducto = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // eslint-disable-next-line 
    var filtrado = filtroProducto.filter((producto) => {
      var textoCompleto = producto.descripcion + " - " + new Intl.NumberFormat('es-PY').format(producto.precio) + " - " + producto.estado;

      if (textoCompleto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(inputValue)) {
        return producto;
      }
    });

    return inputLength === 0 ? [] : filtrado;
  }

  const onSuggestionsClearRequested = () => {
    setproducto([]);
  }

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.descripcion} - ${new Intl.NumberFormat('es-PY').format(suggestion.precio)} - ${suggestion.estado}`;
  }

  const renderSuggestion = (suggestion) => (
    <div className='sugerencia' onClick={() => seleccionarproducto(suggestion)}>
      {`${suggestion.descripcion} - ${new Intl.NumberFormat('es-PY').format(suggestion.precio)} - ${suggestion.estado}`}
    </div>
  );

  const seleccionarproducto = (producto) => {
    setProductoSeleccionado(producto);
  }

  const onChange = (e, { newValue }) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: "Seleccione producto",
    value,
    onChange
  };

  const extraerRegistro = (id) => {
    //console.log('Entra en delete', id);
    const updtblInventario = tblinventariotmp.filter(inv => inv.idproducto !== id);
    setTblInventarioTmp(updtblInventario);
  };


  const eventEnter = (e) => {
    // eslint-disable-next-line 
    if (e.key == "Enter") {
      var split = e.target.value.split('-');
      var producto = {
        producto: split[0].trim(),
        pais: split[1].trim(),
      };
      seleccionarproducto(producto);
    }
  }

  /**********************************************************/
  /***********************Fin Buscador***********************/
  /**********************************************************/

  const btnCancelar = (e) => {
    e.preventDefault();
    navigate('/inventario');
  }

  return (
    <div >
      <div style={{ margin:`20px` }}>
                <h2>Cargar inventario</h2>
            </div>
      <form name="formAdd" onSubmit={agregarLista} >
        <div style={{ backgroundColor: `white`, display: `flex`, alignItems: `center`, justifyContent: `center`, flexWrap: `wrap` }}>
          <label style={{ margin: `10px` }} className="form-label">Producto</label>
          <div style={{ margin: `10px` }} >
            <Autosuggest
              suggestions={producto} onSuggestionsFetchRequested={onSuggestionsFetchRequested} onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue} renderSuggestion={renderSuggestion} inputProps={inputProps} onSuggestionSelected={eventEnter} />
          </div>
          <label style={{ margin: `10px` }} className="form-label">Cantidad</label>
          <div style={{ margin: `10px` }}>
            <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} type="number" className="form-control" />
          </div>
          <button style={{ margin: `10px` }} type="submit" className="btn btn-primary"><IoAddSharp /></button>
        </div>
      </form>
      <label style={{ color: `red`, margin: `10px` }} >{mensaje}</label>
      <Table striped bordered hover>
        <thead className='table-primary'>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {tblinventariotmp.length !== 0 ? tblinventariotmp.map((inv) => (
            <tr key={inv.idproducto}>
              <td> {inv.producto.descripcion} </td>
              <td> {inv.cantidad} </td>
              <td>
                <button onClick={() => extraerRegistro(inv.idproducto)} className='btn btn-danger'><IoTrashOutline /></button>
              </td>
            </tr>
          )) : null
          }
        </tbody>
      </Table>
      <form onSubmit={gestionGuardado}>
        <div style={{ margin: `30px` }}>
          <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Guardar</button>
          <button style={{ margin: `10px` }} onClick={btnCancelar} className="btn btn-primary">Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default CrearInventario