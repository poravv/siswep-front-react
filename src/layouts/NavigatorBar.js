import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import Inicio from '../components/Inicio';
import CrearProductos from '../components/Articulos/CrearArticulos';
import EditarProductos from '../components/Articulos/EditarArticulos';
import ListaArticulos from '../components/Articulos/ListaArticulos';
import ListaProveedor from '../components/Proveedor/ListaProveedor';
import CrearProveedor from '../components/Proveedor/CrearProveedor';
import EditarProveedor from '../components/Proveedor/EditarProveedor';
import Navbar from '../layouts/NavBar';
import ListaInventario from '../components/Inventario/ListaInventario';
import ListaDetInventario from '../components/Inventario/ListaDetInventario';
import CrearInventario from '../components/Inventario/CrearInventario';
import ListaProductoFinal from '../components/ProductoFinal/ListaProductoFinal';
import CrearProductoFinal from '../components/ProductoFinal/CrearProductoFinal';
import ListaCliente from '../components/Clientes/ListaClientes';
import CrearCliente from '../components/Clientes/CrearClientes';
import EditarCliente from '../components/Clientes/EditarClientes';
import ListaVenta from '../components/Venta/ListaVenta';
import ListaDetVenta from '../components/Venta/ListaDetVenta';
import CrearVenta from '../components/Venta/CrearVenta';


function NavigatorBar({ usuario }) {

  //console.log(usuario.body.idusuario);
  //console.log("Suc: ",usuario.body.idsucursal);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar nivel={usuario.body.nivel} />} >
            <Route index element={<Inicio usuario={usuario.body.nick} />} />
            <Route path='/inicio' element={<Inicio />} />
            {
              usuario.body.nivel === 1 ?
                <>

                  #Producto
                  <Route path='/productos' element={<ListaArticulos token={usuario.token} />} />
                  <Route path='/crearprod' element={<CrearProductos idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  <Route path='/editarprod/:id' element={<EditarProductos idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Proveedor
                  <Route path='/proveedor' element={<ListaProveedor token={usuario.token} />} />
                  <Route path='/crearprov' element={<CrearProveedor idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  <Route path='/editarprov/:id' element={<EditarProveedor idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Producto final
                  <Route path='/producto_final' element={<ListaProductoFinal token={usuario.token} />} />
                  <Route path='/crearprodfinal' element={<CrearProductoFinal token={usuario.token} />} />
                  <Route path='*' element={<Navigate replace to='/' />} />
                </>
                : null
            }
            #Inventario
            <Route path='/inventario' element={<ListaInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />
            <Route path='/detinv/:idinventario' element={<ListaDetInventario token={usuario.token} />} />
            <Route path='/crearinv' element={<CrearInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />

            #Cliente
            <Route path='/cliente' element={<ListaCliente token={usuario.token} />} />
            <Route path='/crearcliente' element={<CrearCliente token={usuario.token} />} />
            <Route path='/editarcliente/:id' element={<EditarCliente idusuario={usuario.body.idusuario} token={usuario.token} />} />
            <Route path='*' element={<Navigate replace to='/' />} />
            #Venta
            <Route path='/venta' element={<ListaVenta token={usuario.token} idusuario={usuario.body.idusuario} />} />
            <Route path='/detventa/:idventa' element={<ListaDetVenta token={usuario.token} />} />
            <Route path='/crearventa' element={<CrearVenta token={usuario.token} idusuario={usuario.body.idusuario} idsucursal={usuario.body.idsucursal} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default NavigatorBar;
