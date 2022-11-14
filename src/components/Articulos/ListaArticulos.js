import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Paginador from '../Paginador/Paginador';
import { IoAddSharp, IoTrashOutline, IoPencil,IoHomeOutline } from 'react-icons/io5';
import {logOutSys} from '../../components/Utils/LogOutSys';


const URI = 'http://186.158.152.141:3001/sisweb/api/producto/get';

const ListaArticulos = ({ token }) => {

    const [articulos, setArticulos] = useState([]);
    const [filtroArticulos, setFiltroArticulos] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);


    useEffect(() => {
        getArticulos();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getArticulos = async () => {
        const res = await axios.get(URI, config)
        setArticulos(res.data.body);
        setFiltroArticulos(res.data.body);
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            logOutSys();
        }
    }

    const deleteProducto = async (id) => {
        await axios.delete(`${URI}/del/${id}`, config)
        getArticulos()
    }
    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setArticulos(filtroArticulos.filter((dt) => 
                        (dt.descripcion.indexOf(value)!==-1)
                    ));
        //console.log(filtroArticulos);
    }


/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
const [paginaInicial,setPaginaInicial] = useState(1);
const [registros] = useState(7);
const indiceSiguiente = paginaInicial * registros;
const indiceAnterior = indiceSiguiente - registros;
const articulosPaginado = articulos.slice(indiceAnterior,indiceSiguiente);

//Cambio de pagina
const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/
    return (
        <div className='container'>
            <div style={{ margin:`20px` }}>
                <h2>Articulos</h2>
            </div>
            <div className='row'>
                <div className='col'>
                <Table striped bordered hover>
                        <thead className='table-primary'>
                            <tr>
                                <th>
                                    Articulos
                                    <br />
                                    <input
                                        type="text"
                                        value={labelFilter}
                                        onChange={(e) =>
                                            changeKeyLabel(e.target.value)
                                        } />
                                </th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articulosPaginado.map((prod) => (
                                <tr key={prod.idproducto}>
                                    <td> {prod.descripcion} </td>
                                    <td> {new Intl.NumberFormat('es-PY').format(prod.precio)} </td>
                                    <td> {prod.estado} </td>
                                    <td>
                                        <Link style={{ margin: `5px` }} to={`/editarprod/${prod.idproducto}`} className='btn btn-info'><IoPencil /></Link>
                                        <button style={{ margin: `5px` }} onClick={() => deleteProducto(prod.idproducto)} className='btn btn-danger'><IoTrashOutline /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={articulos.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearprod" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaArticulos