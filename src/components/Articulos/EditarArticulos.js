import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../CSS/Cuerpo.css'

const URI = 'http://186.158.152.141:3001/sisweb/api/producto/'

const EditarProductos = ({ token, idusuario }) => {
    //console.log(token);
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0);
    const [peso, setPeso] = useState(0);
    const [estado, setEstado] = useState(0);
    // eslint-disable-next-line
    const [img, setImg] = useState('');
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
            descripcion: descripcion,
            precio: precio,
            peso: peso,
            estado: estado,
            idusuario_upd: idusuario,
            //img:img,
        }, config
        );
        navigate('/productos')
    }

    useEffect(() => {
        getProductoId()
        // eslint-disable-next-line
    }, [])

    const getProductoId = async () => {
        const res = await axios.get(URI + "get/" + id, config);
        setDescripcion(res.data.body.descripcion);
        setPrecio(parseInt(res.data.body.precio));
        setPeso(res.data.body.peso);
        setEstado(res.data.body.estado);
        //setIdusuario(res.data.body.idusuario);
        setImg(res.data.body.img);
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/productos');
    }

    return (
        <div className="cuerpo">
            
            <form onSubmit={update} >
            <div style={{ margin:`20px` }}>
                <h2>Actualizar articulo</h2>
            </div>
                <div className="mb-3">
                    <label className="form-label">descripcion</label>
                    <input
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        type="number"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        type="text"
                        className="form-control"
                    />
                </div>

                <div style={{ margin: `30px` }}>
                    <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Actualizar</button>
                    <button style={{ margin: `10px` }} onClick={btnCancelar}
                        className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )

}

export default EditarProductos