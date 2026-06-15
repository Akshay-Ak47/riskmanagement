import {
    ReactNode,
    useState
} from "react";

import "./../styles/Layout.css";

import Header from "./Header";

import Sidebar from "./Sidebar";

type LayoutProps = {

    children: ReactNode;
};

function Layout({
    children
}: LayoutProps) {

    const [isOpen, setIsOpen] =
        useState(false);

    const toggleSidebar = () => {

        console.log("clicked");

        setIsOpen(prev => !prev);
    };

    return (

        <div>

            <Header
                toggleSidebar={toggleSidebar}
                isOpen={isOpen}
            />

            <Sidebar
                isOpen={isOpen}
            />

           <div
               className={
                   isOpen
                       ? "main-content sidebar-open"
                       : "main-content sidebar-close"
               }
           >

                {children}

            </div>

        </div>
    );
}

export default Layout;