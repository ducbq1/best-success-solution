
export default function TableDashboard(props) {
    console.log(props);
    return (
        <table>
            <caption>the best table ever in the world</caption>
            <thead>
                <tr>
                    <th>Devices</th>
                    <th>MAC Address</th>
                    <th>IP</th>
                    <th>Created Date</th>
                    <th>Power Consumption (kW/h)</th>
                </tr>
            </thead>
            <tbody id="dataBody">
                {props.items.map(item => (
                    <tr key={item.mac} id="dataBody">
                        <td>{item.name}</td>
                        <td>{item.mac}</td>
                        <td>{item.ip}</td>
                        <td>{item.datetime}</td>
                        <td>{item.power}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="4">Total</td>
                    <td id="dataTotal">{props.total}</td>
                </tr>
            </tfoot>
        </table>
    )
}

