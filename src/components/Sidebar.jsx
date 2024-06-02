import {Outlet} from 'react-router-dom'

import styles from './Sidebar.module.css'
import Logo from './Logo';
import AppNav from './AppNav';
import Footer from './Footer';

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo/>
            <AppNav/>

            <Outlet/>

           <Footer/>
        </div>
    )
}

export default Sidebar
