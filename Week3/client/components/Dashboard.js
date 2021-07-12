import Chart from './Chart';
import { useEffect, useState } from "react";
import TableDashboard from './TableDashboard';
import { randomColor, macGenerate, ipGenerate } from '../api/misc';


export default function Dashboard(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [chart, setChart] = useState({});

    useEffect(() => {
        fetch(props.urlget, { method: 'get' })
            .then(res => res.json())
            .then(result => {
                console.log(props.urlget);
                setIsLoaded(true);
                setItems(result);
                let cloneChart = {
                    labels: result.map(item => item.name),
                    datasets: [{
                        label: 'Power Consumption',
                        backgroundColor: result.map(() => randomColor()),
                        hoverBackgroundColor: result.map(() => randomColor()),
                        data: result.map(item => item.power)
                    }]
                }
                setChart(cloneChart);

            },
                error => {
                    setIsLoaded(true);
                    setError(error);
                })
    }, [props.urlget]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let input = {
            [event.target[0].name]: event.target[0].value,
            [event.target[1].name]: event.target[1].value,
            [event.target[2].name]: event.target[2].value,
        }

        let appendItem = {
            name: input.name,
            mac: await macGenerate(),
            ip: input.ip || await ipGenerate(),
            datetime: new Date().toLocaleDateString('en-US'),
            power: Number(input.power)
        }

        let cpyItem = [...items, appendItem];
        await setItems(cpyItem);

        let cloneChart = {
            labels: cpyItem.map(item => item.name),
            datasets: [{
                label: 'Power Consumption',
                backgroundColor: cpyItem.map(() => randomColor()),
                hoverBackgroundColor: cpyItem.map(() => randomColor()),
                data: cpyItem.map(item => item.power)
            }]
        }

        await setTimeout(() => setChart(cloneChart), 0);
        await fetch(props.urlpost, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appendItem)
        })
    }


    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (<div>
            <TableDashboard items={items} total={items.reduce((a, b) => a + Number(b.power), 0)} />
            <section className="data-section">
                <Chart state={chart} />
                <form className="form-input" onSubmit={handleSubmit}>
                    <input type="text" name="name" id="name" placeholder="Name"
                        onInvalid={(event) => event.target.setCustomValidity("Please insert username!")}
                        onInput={(event) => event.target.setCustomValidity("")}
                        required />
                    <input type="text" name="ip" id="ip" placeholder="IP" />
                    <input type="number" name="power" id="power" placeholder="Power Consumption"
                        onInvalid={(event) => event.target.setCustomValidity("Please insert power consumption!")}
                        onInput={(event) => event.target.setCustomValidity("")}
                        required />
                    <input type="submit" id="button" value="ADD DEVICE" />
                </form>
            </section>
        </div>

        );
    }
}