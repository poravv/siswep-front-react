import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import '../../CSS/Buscador.css'

const URI = 'http://186.158.152.141:3001/sisweb/api/proveedor/'
let fechaActual = new Date();

const CrearProveedor = ({ token, idusuario }) => {
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
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
            idproveedor: 0,
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            estado: "AC"
        }, config
        );
        navigate('/proveedor')
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/proveedor');
    }


    return (
        <div className="cuerpo">
            
            <form onSubmit={create} >
            <div style={{ margin:`20px` }}>
                <h2>Crear proveedor</h2>
            </div>
                <div className="mb-3">
                    <label className="form-label">Razon Social</label>
                    <input value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ruc</label>
                    <input value={ruc} onChange={(e) => setRuc(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Direccion</label>
                    <input value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefono</label>
                    <input value={telefono} onChange={(e) => setTelefono(e.target.value)} type="text" className="form-control" />
                </div>
                <div style={{ margin:`30px` }}>
                    <button style={{ margin:`10px` }} type="submit" className="btn btn-primary">Agregar</button>
                    <button style={{ margin:`10px` }} onClick={btnCancelar}
                        className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )

}

export default CrearProveedor