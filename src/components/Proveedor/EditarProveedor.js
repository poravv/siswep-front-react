import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../CSS/Cuerpo.css'

const URI = 'http://186.158.152.141:3001/sisweb/api/proveedor/';
let fechaActual = new Date();

const EditarProveedor = ({ token, idusuario }) => {
    //console.log(token);
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDir] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState('');
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
            estado: estado
        }, config
        );

        navigate('/proveedor')
    }

    useEffect(() => {
        getProveedorId()
        // eslint-disable-next-line
    }, [])

    const getProveedorId = async () => {
        const res = await axios.get(URI + "get/" + id, config);
        setRazonSocial(res.data.body.razon_social);
        setRuc(res.data.body.ruc);
        setDir(res.data.body.direccion);
        setTelefono(res.data.body.telefono);
        setEstado(res.data.body.estado);
    }

    const btnCancelar = (e)=> {
        e.preventDefault();
        navigate('/proveedor');
    }

    return (
        <div className="cuerpo">
            
            <form onSubmit={update} >
            <div style={{ margin:`20px` }}>
                <h2>Editar proveedor</h2>
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

                <div style={{ margin:`30px` }}>
                    <button style={{ margin:`10px` }} type="submit" className="btn btn-primary">Actualizar</button>
                    <button style={{ margin:`10px` }} onClick={btnCancelar}
                        className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )

}

export default EditarProveedor