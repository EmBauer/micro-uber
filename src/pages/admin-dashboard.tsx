import Map from "../components/map.tsx"
import {AiOutlineArrowRight} from "@react-icons/all-files/ai/AiOutlineArrowRight"
import {ReactNode} from "react";

function AdminDashboard() {
    return (
        <>
            <div className={"flex flex-col md:flex-row"}>
                <div className={"w-full md:w-1/2 m-5"}>
                    <Tile heading={"12 Drivers live"}>
                        <h2>83% occupation (10/12)</h2>
                        <div className={"flex gap-4 mt-3"}>
                            <button className={"w-full hover:bg-blue-200"}>Look at map</button>
                            <button className={"w-full hover:bg-blue-200"}>Manage drivers</button>
                        </div>
                    </Tile>
                    <Tile heading={"Ongoing routes"}>
                        <div className={"my-3"}>
                            <Route start={"Hill St."} destination={"World Trade Center"} status={"In progress"}></Route>
                            <Route start={"Madison Ave."} destination={"Central Park"}
                                   status={"Waiting for pickup"}></Route>
                        </div>
                        <div className={"mt-3"}>
                            <button className={"hover:bg-blue-200"}>More...</button>
                        </div>
                    </Tile>
                </div>
                <div className={"h-[89vh] w-full p-5"}>
                    <Map selectedDestination={[51.505, -0.09]}></Map>
                </div>
            </div>
        </>
    );
}

type RouteProps = {
    start: string,
    destination: string,
    status: string
}

function Route({start, destination, status}: RouteProps) {
    return (
        <div className={"flex gap-3"}>
            <div className={"flex items-center gap-2"}>{start}<AiOutlineArrowRight/>{destination}</div>
            <div className={"text-red-500"}>{status}</div>
        </div>
    )
}

type TileProps = {
    children: ReactNode,
    heading: string,
}

function Tile({children, heading}: TileProps){
    return(
        <div className={"border-black border-2 rounded-xl m-4 p-3 max-w-lg min-w-96"}>
            <h1 className={"font-bold text-4xl"}>{heading}</h1>
            {children}
        </div>)
}

export default AdminDashboard;
