import { useRouter } from 'next/router';
import Link from 'next/link';

function ActiveLink({ children, href, ...props }) {
    const router = useRouter();
    const style = {
        color: router.asPath === href ? 'blue' : 'black',
    }

    const handleClick = (e) => {
        e.preventDefault();
        router.push(href);
    }

    return (
        <Link href={href}>
            <a onClick={handleClick} style={style}>{props.link}</a>
        </Link>
    );
}

export default ActiveLink;