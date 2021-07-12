import Header from '../components/Header';
import Navigator from '../components/Navigator';
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHotel, faUser } from '@fortawesome/free-solid-svg-icons'


export default function Dash() {
    return (
        <Layout>
            <Header title="Dashboard" />
            <Navigator />
            <main role="main">
                <section>
                    <span className="device-manager"><FontAwesomeIcon icon={faHotel} />&nbsp;&nbsp;Device Manager</span>
                    <div className="welcome">
                        <p id="account" data-value="1"><FontAwesomeIcon icon={faUser} />&nbsp;&nbsp;Welcome Guest</p>
                        <Link href="/">
                            <a>Exit</a>
                        </Link>
                    </div>
                </section>
                {/* <Dashboard urlget="http://10.10.66.198:3001/dashboard"
                    urlpost="http://10.10.66.198:3001/dashboard/insert" /> */}
                <Dashboard urlget="http://127.0.0.1:3001/dashboard"
                    urlpost="http://127.0.0.1:3001/dashboard/insert" />
            </main>
        </Layout>
    );
}






