function DriverNotificationWindow() {
    return (
        <div className={"w-fit h-fit p-10 bg-secondary absolute z-10 left-0 right-0 top-0 bottom-0 m-auto rounded-3xl "}>
            <h1 className={"text-2xl font-bold"}>Driving service was requested from ... to ...</h1>
            <div className={"flex justify-center gap-5 m-3"}>
                <button className={"w-full"}>Accept</button>
                <button className={"w-full"}>Reject</button>
            </div>
        </div>
    )
}

export default DriverNotificationWindow;