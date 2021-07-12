import Header from "../components/Header";
import Logs from '../components/Logs';
import Navigator from "../components/Navigator";
import Layout from "../components/Layout";

export default function Log() {
    return (
        <Layout>
            <Header title="Logs" />
            <Navigator />
            <main role="main">
                {/* <Logs url="http://10.10.66.198:3001/logs" /> */}
                <Logs url="http://127.0.0.1:3001/logs" />
            </main>
        </Layout>
    );
}










