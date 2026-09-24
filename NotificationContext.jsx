import { useState, useContext, createContext } from "react";
const NotificationContext = createContext();



export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState([])
    const [active100, setActive100] = useState(false)

    function addNotification(type, title, message) {
        const newNotification = {
            id: Date.now(),
            type: type,
            title: title,
            message: message
        }

        setNotification((previousNotification) => [

            newNotification, ...previousNotification
        ])
    }
    return (
        <NotificationContext.Provider value={{ notification, addNotification, active100, setActive100 }}>
            {children}
        </NotificationContext.Provider>

    )
}

export function useNotification() {
    return useContext(NotificationContext)
}