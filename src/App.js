
import './App.css';
import Footer from './layouts/Footer';
import { useEffect, useState } from 'react';
import NavigatorBar from './layouts/NavigatorBar'
import LoginForm from './components/LoginForm';

function App() {

  const [userApp, setUserApp] = useState(null);
  
  useEffect(() => {

    const loggedUserJSON =window.localStorage.getItem('loggedSiswebUser');
        if (loggedUserJSON) {
            const userJson = JSON.parse(loggedUserJSON);
            setUserApp(userJson);
            //console.log("Suc: ",userJson.body.idsucursal);
        }
  }, []);

  return (
    <div className="App" >
      {
        userApp ? <NavigatorBar usuario={userApp} /> : <LoginForm/>
      }
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
