import DriverMap from "../components/driver-map.tsx";
import {useState} from "react";
import DriverTopBar from "../components/driver-top-bar.tsx";
import {FaCar} from "@react-icons/all-files/fa/FaCar"

function DriverDashboard() {
    const [shouldMove, setShouldMove] = useState(false)
    return (
        <>
            <DriverTopBar/>
            <div className={"relative m-3"}>
                <button className={"hover:bg-secondary text-2xl m-3 w-1/4 border-black border-2"} onClick={() => setShouldMove(!shouldMove)}>
                    <div className={"flex justify-center gap-3 items-center"}><FaCar className={"text-3xl"}/> {shouldMove ? "Stop Car" : "Start Car"}</div>
                </button>
                <div className={"p-5 h-[80vh]"}>
                    <DriverMap shouldMove={shouldMove}/>
                </div>
            </div>
        </>
    );

}

export default DriverDashboard