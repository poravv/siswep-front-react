import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../CSS/Cuerpo.css';
import Autosuggest from 'react-autosuggest';

const URI = 'http://186.158.152.141:3001/sisweb/api/cliente/';
const URICIUDAD = 'http://186.158.152.141:3001/sisweb/api/ciudad/';
let fechaActual = new Date();

const EditarCliente = ({ token, idusuario }) => {
    //console.log(token);
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDir] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState('');
    const [correo, setCorreo] = useState('');
    const navigate = useNavigate();

    const { id } = useParams();

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    //procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault();


        await axios.put(URI + "put/" + id, {
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_upd: strFecha,
            fecha_insert: strFecha,
            estado: estado,
            correo:correo,
            idciudad:ciudadSeleccionada.idciudad
        }, config
        );

        navigate('/cliente')
    }

    useEffect(() => {
        getClienteId()
        // eslint-disable-next-line
    }, [])

    const getClienteId = async () => {
        const res = await axios.get(URI + "get/" + id, config);
        setRazonSocial(res.data.body.razon_social);
        setRuc(res.data.body.ruc);
        setDir(res.data.body.direccion);
        setTelefono(res.data.body.telefono);
        setCorreo(res.data.body.correo);
        setEstado(res.data.body.estado);
        setCiudadSeleccionado(res.data.body.ciudad);
        //setciudad(res.data.body.ciudad);
        setValue(res.data.body.ciudad.descripcion);
    }

    const btnCancelar = (e)=> {
        e.preventDefault();
        navigate('/cliente');
    }

    /**********************************************************/
    /**************************Buscador************************/
    /**********************************************************/

    const [ciudad, setciudad] = useState([]);
    const [filtroCiudad, setFiltroCiudad] = useState([]);
    const [value, setValue] = useState("");
    const [ciudadSeleccionada, setCiudadSeleccionado] = useState(null);


    const getCiudades = async () => {
        const res = await axios.get(URICIUDAD + "get/", config);
        setciudad(res.data.body);
        setFiltroCiudad(res.data.body);
    }

    useEffect(() => {
        getCiudades()
        // eslint-disable-next-line
    }, [])

    const onSuggestionsFetchRequested = ({ value }) => {
        setciudad(filtrarciudad(value));
    }

    const filtrarciudad = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        // eslint-disable-next-line 
        var filtrado = filtroCiudad.filter((ciudad) => {
            var textoCompleto = ciudad.descripcion + " - " + ciudad.estado;

            if (textoCompleto.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(inputValue)) {
                return ciudad;
            }
        });

        return inputLength === 0 ? [] : filtrado;
    }

    const onSuggestionsClearRequested = () => {
        setciudad([]);
    }

    const getSuggestionValue = (suggestion) => {
        return `${suggestion.descripcion}  - ${suggestion.estado}`;
    }

    const renderSuggestion = (suggestion) => (
        <div className='sugerencia' onClick={() => seleccionarciudad(suggestion)}>
            {`${suggestion.descripcion} - ${suggestion.estado}`}
        </div>
    );

    const seleccionarciudad = (ciudad) => {
        setCiudadSeleccionado(ciudad);
    }

    const onChange = (e, { newValue }) => {
        setValue(newValue);
    }

    const inputProps = {
        placeholder: "Seleccione ciudad",
        value,
        onChange
    };

    const eventEnter = (e) => {
        // eslint-disable-next-line 
        if (e.key == "Enter") {
            var split = e.target.value.split('-');
            var ciudad = {
                ciudad: split[0].trim(),
            };
            seleccionarciudad(ciudad);
        }
    }

    /**********************************************************/
    /***********************Fin Buscador***********************/
    /**********************************************************/

    return (
        <div className="cuerpo">
            
            <form onSubmit={update} >
            <div style={{ margin:`20px` }}>
                <h2>Editar cliente</h2>
            </div>
                <div className="mb-3">
                    <label className="form-label">Razon social</label>
                    <input value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} type="text" className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ruc</label>
                    <input value={ruc} onChange={(e) => setRuc(e.target.value)} type="text" className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Direccion</label>
                    <input value={direccion} onChange={(e) => setDir(e.target.value)} type="text" className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefono</label>
                    <input value={telefono} onChange={(e) => setTelefono(e.target.value)} type="text" className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input value={estado} onChange={(e) => setEstado(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input value={correo} onChange={(e) => setCorreo(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ciudad</label>
                    <Autosuggest
                        suggestions={ciudad} onSuggestionsFetchRequested={onSuggestionsFetchRequested} onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue} renderSuggestion={renderSuggestion} inputProps={inputProps} onSuggestionSelected={eventEnter} />
                </div>

                <div style={{ margin:`30px` }}>
                    <button style={{ margin:`10px` }} type="submit" className="btn btn-primary">Actualizar</button>
                    <button style={{ margin:`10px` }} onClick={btnCancelar}
                        className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )

}

export default EditarCliente