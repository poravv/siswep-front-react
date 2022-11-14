
import { IoLogoInstagram, IoLogoWhatsapp, IoLogoLinkedin,IoLogoGithub } from 'react-icons/io5';
import '../CSS/Footer.css'

function Footer() {
    return (
        <>
            <section>
                <div className='footer'>
                <br/>
                    <p className='footer p'> <b>© 2022 Copyright</b> </p>
                    <p>andyvercha@gmail.com<br />+595 992 756 462 </p>
                    <div className='myfooter'>
                        <a href="https://wa.me/595992756462"><h1><IoLogoWhatsapp className='iconos' /></h1></a>
                        <a href="https://www.instagram.com/_vienecadames_/"><h1><IoLogoInstagram className='iconos' /></h1></a>
                        <a href="https://www.linkedin.com/in/andr%C3%A9s-valentin-vera-chavez-b3baa6188/"><h1><IoLogoLinkedin className='iconos' /></h1></a>
                        <a href="https://github.com/poravv"><h1><IoLogoGithub className='iconos' /></h1></a>
                    </div>
                </div>
            </section>
        </>
    );
}
export default Footer