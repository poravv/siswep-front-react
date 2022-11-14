
import {  useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../CSS/LoginForm.css'
import LoginServices from '../services/Login'
import '../CSS/Cuerpo.css'
//import { useNavigate } from 'react-router-dom';


function LoginForm() {
    //poravv-andres
    const [errorMensaje, setErrorMensaje] = useState(null);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    //const navigate = useNavigate();



    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        //console.log('Presionado el submit');
        try {
            const usuarioRes = await LoginServices({
                nick: username,
                password: password
            });
            setUser(usuarioRes);
            setUserName('');
            setPassword('');
            console.log(user);
            window.localStorage.setItem(
                'loggedSiswebUser', JSON.stringify(usuarioRes)
            );
            // eslint-disable-next-line
            window.location.href = window.location.href;
            //navigate('/');

        } catch (e) {
            console.log(e);
            setErrorMensaje('Error de usuario o contraseña');
            setTimeout(() => {
                setErrorMensaje(null);
            }, 5000);
        }
    }

    return (
        <div>
            <div className='header' style={{ backgroundColor: `black` }}>
                <h1 style={{ color: `white` }}>
                    Acceso al sistema
                </h1>
            </div>
            <div className='cuerpo'>
                <Form className='form-login' onSubmit={handleLoginSubmit}>

                    <label style={{ color: `red` }} >{errorMensaje}</label>

                    <Form.Group className="mb-3" controlId="formBasicusuario">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control type="usuario" placeholder="usuario" onChange={({ target }) => setUserName(target.value)} />
                        <Form.Text className="text-muted">
                            No compartas tus credenciales de seguridad
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña" onChange={({ target }) => setPassword(target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Acceder
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginForm;