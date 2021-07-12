
export default function TableLogs(props) {
    return (
        <table>
            <caption>A Table</caption>
            <thead>
                <tr>
                    <th>Devices ID</th>
                    <th>Name</th>
                    <th>Action</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="dataBody">
                {props.items.map(item => (
                    <tr key={item.id} id="dataBody">
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.action}</td>
                        <td>{item.date}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="3">Total</td>
                    <td id="dataTotal">{Math.round(Math.random() * 1000)}</td>
                </tr>
            </tfoot>
        </table>
    );
}

