import Head from 'next/head';

export default function Header(props) {
    return (
        <Head>
            <title>{props.title}</title>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    );
}
