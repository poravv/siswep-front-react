import React from 'react'
import { Form } from 'react-bootstrap';
import '../CSS/Cuerpo.css';

export const Inicio = ({usuario}) => {
    return (
            <div className='cuerpo'>
                <Form>
                <h2>Bienvenido usuario {usuario}</h2>
                <br/>
                <p>Te damos algunas recomendaciones</p>
                </Form>
            </div>
    );
}
export default Inicio;