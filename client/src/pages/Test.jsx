import { ping } from "../services/api";
import { useEffect, useState } from "react";

const Test = () => {
    const [status, setStatus] = useState('waiting');

    useEffect(() => {
        const pingAPI = async () => {
            try {
                const apiStatus = await ping();
                setStatus(apiStatus.message);
                console.log(apiStatus);
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        pingAPI();
    }, []);

    return <>{status}</>;
};

export default Test;