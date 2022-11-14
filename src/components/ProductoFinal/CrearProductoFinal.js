import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import Autosuggest from 'react-autosuggest';
import '../../CSS/Buscador.css';
import { IoAddSharp, IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import AlertModal from '../Utils/AlertModal';
import Form from 'react-bootstrap/Form';


const URI = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URIRECETA = 'http://186.158.152.141:3001/sisweb/api/receta/';
const URIPROVEEDOR = 'http://186.158.152.141:3001/sisweb/api/producto/';



const CrearProductoFinal = ({ token }) => {

    //const fechaActual = new Date();
    //console.log(token);

    //const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();

    //console.log(strFecha);

    const navigate = useNavigate();
    const [tblproducto_finaltmp, setTblProductoFinalTmp] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [costo, setCosto] = useState(0);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [total, setTotal] = useState(0);
    const [montoiva, setMontoIva] = useState(0);

    //Llamada a alerta y su mensaje
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [mensaje, setMensaje] = useState(null);


    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    //procedimiento para actualizar
    const gestionGuardado = async (e) => {
        e.preventDefault();

        /*
        1- Armar un loop para recorrer cada registro -ok
        2- Buscar si existe un registro de la cabecera por el producto
        3-Insertar cabecera si no existe y actualizar si es que existe
        */
        //console.log("Guarda cabecera");
        if (nombre.trim===''||descripcion.trim==='' ||costo<0 ||tipoIva===0) {
            //console.log("ERROR: ");
            setMensaje('Verificar valores cargados.')
            setTimeout(() => {
                setMensaje(null)
            }, 8000);
            handleShow();
            return null;
            //<label style={{ color: `red`, margin: `10px` }} >{mensaje}</label>
        }
        try {
            guardaCab(
                {
                    estado: 'AC',
                    nombre: nombre,
                    descripcion: descripcion,
                    costo: costo,
                    tipo_iva:tipoIva,
                    monto_iva:montoiva
                }
            ).then((cabecera) => {

                //console.log('El id es: ', cabecera);

                if (cabecera.data.error) {
                    //console.log("ERROR: ");
                    setMensaje('Error en el guardado, verifique que el producto ya no exista.')
                    setTimeout(() => {
                        setMensaje(null)
                    }, 8000);
                    handleShow();
                    return null;
                    //<label style={{ color: `red`, margin: `10px` }} >{mensaje}</label>
                }

                //Guardado del detalle
                tblproducto_finaltmp.map((producto) => {

                    //console.log('Producto: ',producto);
                    //console.log('Cantidad: ',producto.cantidad);

                    try {
                        guardarReceta({
                            idproducto_final: cabecera.data.body.idproducto_final,
                            receta_estado: 'AC',
                            estado: producto.producto.estado,
                            idproducto: producto.producto.idproducto,
                            cantidad: producto.cantidad
                        });
                        return true;
                    } catch (error) {
                        console.log(error);
                        return false;
                    }
                })

            });
        } catch (e) {
            console.log(e);
        }
    }

    const guardaCab = async (valores) => {
        //console.log("Entra en guardaCab");
        //Guardado de cabecera
        return await axios.post(URI + "post/", valores, config);
        //console.log(invCabecera);
    }

    const guardarReceta = async (valores) => {
        await axios.post(URIRECETA + "post/", valores, config);
        navigate('/producto_final');
    }

    const agregarLista = async (e) => {
        e.preventDefault();

        const validExist = tblproducto_finaltmp.filter((inv) => inv.idproducto === productoSeleccionado.idproducto);
        //console.log(productoSeleccionado);

        if (productoSeleccionado !== null) {
            if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
                if (validExist.length === 0) {

                    tblproducto_finaltmp.push({
                        idproducto: productoSeleccionado.idproducto,
                        producto: productoSeleccionado,
                        cantidad: cantidad
                    });
                    setTotal(total + (cantidad * productoSeleccionado.precio))
                    setProductoSeleccionado(null);
                    setproducto([]);
                    setCantidad(0);
                    setValue("");

                } else {
                    setMensaje('El producto ya existe en la lista')
                    setTimeout(() => {
                        setMensaje(null)
                    }, 8000);
                    handleShow();
                }
            } else {
                setMensaje('Cargue la cantidad')
                setTimeout(() => {
                    setMensaje(null)
                }, 8000);
                handleShow();
            }
        } else {
            setMensaje('Selecciona un producto')
            setTimeout(() => {
                setMensaje(null)
            }, 5000);
        }
    }

    const [tipoIva, setTipoIva] = useState(0);
    const [habilita, setHabilita] = useState(false);


    const cambioCheck = (e) => {
        //e.preventDefault();
        setHabilita(true)
        const { id } = e.target;
        //console.log(id,checked)
        setTipoIva(id);
        setMontoIva(costo*parseInt(id)/100);
    }


    /**********************************************************/
    /**************************Buscador************************/
    /**********************************************************/

    const [producto, setproducto] = useState([]);
    const [filtroProducto, setFiltroProducto] = useState([]);
    const [value, setValue] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);


    const getProductos = async () => {
        const res = await axios.get(URIPROVEEDOR + "get/", config);
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
        placeholder: "Seleccione materia",
        value,
        onChange
    };

    const extraerRegistro = (id, costo) => {

        console.log('Entra en delete', id);

        setTotal(total - costo);

        tblproducto_finaltmp.filter(inv => inv.idproducto !== id);

        const updtblProductoFinal = tblproducto_finaltmp.filter(inv => inv.idproducto !== id);
        setTblProductoFinalTmp(updtblProductoFinal);


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
        navigate('/producto_final');
    }

    return (
        <div >

            <div style={{ margin: `20px` }}>
                <h2>Cargar Producto</h2>
            </div>
            <form onSubmit={agregarLista}  >

                <div className="mb-3">
                    <label className="form-label">Nombre(*)</label>
                    <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }}>
                        <input style={{ maxWidth: `500px` }} value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" className="form-control" />
                    </div>
                    <label className="form-label">Descripcion(*)</label>
                    <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }}>
                        <input style={{ maxWidth: `500px` }} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} type="text" className="form-control" />
                    </div>
                    <label className="form-label">Precio(*)</label>
                    <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }}>
                        <input disabled={habilita} style={{ maxWidth: `500px` }} value={costo} onChange={(e) => {
                            setCosto(e.target.value);
                            setMontoIva(costo*parseInt(tipoIva)/100);
                        }} type="number" className="form-control" />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo iva(*)</label>
                    <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }} key={`radio`} id={'radio'} className="mb-3">
                        <Form.Check
                            style={{ margin: `5px` }}
                            type={'radio'}
                            id={5}
                            label={`5%`}
                            name='radio'
                            onChange={cambioCheck}
                        />
                        <Form.Check
                            style={{ margin: `5px` }}
                            type={'radio'}
                            id={10}
                            label={`10%`}
                            name='radio'
                            onChange={cambioCheck}
                        />
                    </div>
                    <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }}>
                        <input disabled style={{ maxWidth: `200px` }} value={montoiva} type="number" className="form-control" />
                    </div>
                </div>

                <div style={{ backgroundColor: `white`, display: `flex`, alignItems: `center`, justifyContent: `center`, flexWrap: `wrap` }}>
                    <label style={{ margin: `10px` }} className="form-label">Materia </label>
                    <div style={{ margin: `10px` }}>
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




            <Table striped bordered hover>
                <thead className='table-primary'>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {tblproducto_finaltmp.length !== 0 ? tblproducto_finaltmp.map((inv) => (
                        <tr key={inv.idproducto}>
                            <td> {inv.producto.descripcion} </td>
                            <td> {inv.cantidad} </td>
                            <td> {inv.cantidad * inv.producto.precio} </td>
                            <td>
                                <button onClick={() => extraerRegistro(inv.idproducto, (inv.cantidad * inv.producto.precio))} className='btn btn-danger'><IoTrashOutline /></button>
                            </td>
                        </tr>
                    )) : null
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <th colSpan={3}>
                            <b>{total}</b>
                        </th>
                    </tr>
                </tfoot>
            </Table>
            <div style={{ alignItems: `center`, justifyContent: `center`, display: `flex` }}>
                {mensaje ? <AlertModal tipoMensaje={'danger'} mensaje={mensaje} show={show} handleClose={handleClose} /> : null}
            </div>
            <form onSubmit={gestionGuardado}>
                <div style={{ margin: `30px` }}>
                    <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Guardar</button>
                    <button style={{ margin: `10px` }} onClick={btnCancelar} className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export default CrearProductoFinal