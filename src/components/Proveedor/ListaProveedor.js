import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { IoAddSharp, IoTrashOutline, IoPencil, IoHomeOutline } from 'react-icons/io5';
import Paginador from '../Paginador/Paginador';
import {logOutSys} from '../../components/Utils/LogOutSys';


const URI = 'http://186.158.152.141:3001/sisweb/api/proveedor/get'


const ListaProveedor = ({ token }) => {
    //console.log(token);

    const [proveedor, setProveedor] = useState([]);
    const [filtroProveedor, setFiltroProveedor] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);
    const [rucFilter, setRucFilter] = useState([]);


    useEffect(() => {
        getProveedor();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProveedor = async () => {
        const res = await axios.get(URI, config)
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            logOutSys();
        }

        setProveedor(res.data.body);
        setFiltroProveedor(res.data.body);
        //console.log(filtroProveedor);
    }

    const deleteProveedor = async (id) => {
        await axios.delete(`${URI}/del/${id}`, config)
        getProveedor();
    }
    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setProveedor(filtroProveedor.filter((dt) =>
            (dt.razon_social.indexOf(value) !== -1)
        ));
        //console.log(filtroProveedor);
    }

    const changeKeyRucLabel = (value) => {
        setRucFilter(value);
        setProveedor(filtroProveedor.filter((dt) =>
            (dt.ruc.indexOf(value) !== -1)
        ));
        //console.log(filtroProveedor);
    }

/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
const [paginaInicial,setPaginaInicial] = useState(1);
const [registros] = useState(7);
const indiceSiguiente = paginaInicial * registros;
const indiceAnterior = indiceSiguiente - registros;
const proveedorPaginado = proveedor.slice(indiceAnterior,indiceSiguiente);

//Cambio de pagina
const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/


    return (
        <div className='container'>
            <div style={{ margin: `20px` }}>
                <h2>Proveedores</h2>
            </div>
            <div className='row'>
                <div className='col'>
                <Table striped bordered hover>
                        <thead className='table-primary'>
                            <tr>
                                <th>
                                    Proveedor
                                    <br />
                                    <input
                                        type="text"
                                        value={labelFilter}
                                        onChange={(e) =>
                                            changeKeyLabel(e.target.value)
                                        } />
                                </th>
                                <th>
                                    ruc
                                    <br />
                                    <input
                                        type="text"
                                        value={rucFilter}
                                        onChange={(e) =>
                                            changeKeyRucLabel(e.target.value)
                                        } />
                                </th>
                                <th>direccion</th>
                                <th>telefono</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proveedorPaginado.map((prod) => (
                                <tr key={prod.idproveedor}>
                                    <td> {prod.razon_social} </td>
                                    <td> {prod.ruc} </td>
                                    <td> {prod.direccion} </td>
                                    <td> {prod.telefono} </td>
                                    <td>
                                        <Link style={{ margin: `5px` }} to={`/editarprov/${prod.idproveedor}`} className='btn btn-info'><IoPencil /></Link>
                                        <button style={{ margin: `5px` }} onClick={() => deleteProveedor(prod.idproveedor)} className='btn btn-danger'><IoTrashOutline /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={proveedor.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearprov" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaProveedor