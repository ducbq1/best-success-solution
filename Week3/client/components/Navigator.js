import ActiveLink from "./ActiveLink";

export default function navigator() {
    return (
        <div className="navigator">
            <div className="menu-toggle">
                <input type="checkbox" name="" id="" />
                <span></span><span></span><span></span>
                <div className="menu">
                    <ActiveLink href="/dash" link="Dashboard" />
                    <ActiveLink href="/log" link="Logs" />
                    <ActiveLink href="/settings" link="Settings" />
                </div>
            </div>
        </div>
    );
}