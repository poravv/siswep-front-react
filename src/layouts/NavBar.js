
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../CSS/NavBar.css';
import {logOutSys} from '../components/Utils/LogOutSys';


const NavBarV1 = ({nivel}) => {
    //console.log(nivel);
    
    //<Nav.Link as={Link} to='/inventario' >Inventario</Nav.Link>
    return (
        <>
            <header>
                <Navbar className='navBg' expand="lg" variant="dark" >
                    <Container >
                        <Navbar.Brand href="/">Inicio</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="Almacen" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to='/proveedor' >Proveedor</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/productos' >Articulos</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/producto_final' >Producto</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/inventario' >Inventario</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Ventas" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to='/cliente' >Cliente</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/Venta' >Venta</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={logOutSys} >Cerrar sesion</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

            <Outlet />
        </>
    );
}

export default NavBarV1;