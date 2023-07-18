'use client'
import styles from './navigation.module.css';
import Link from 'next/link';
import {usePathname} from "next/navigation";

export default function Navigation() {
    return (
        <div id="navigation" className={styles.wrapper}>
            <div className={styles.navigation}>
                <Link id="5899680" className={usePathname() === '/' ? "activeTab" : "tab"} href="/">Доходы</Link>
                <Link id="5899687" className={usePathname() === '/outcome' ? "activeTab" : "tab"} href="outcome">Расходы</Link>
                <Link id="5899640" className={usePathname() === '/assets' ? "activeTab" : "tab"} href="assets">Активы</Link>
                <Link id="5899663" className={usePathname() === '/liabilities' ? "activeTab" : "tab"} href="liabilities">Обязательства</Link>
                <Link id="5899675" className={usePathname() === '/capital' ? "activeTab" : "tab"} href="capital">Капитал</Link>
            </div>
        </div>
    )
}