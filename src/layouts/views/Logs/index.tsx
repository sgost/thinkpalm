import React from "react";
import {
    Icon,
    Cards,
    Logs,
} from "atlasuikit";

const LogsCompo = (props: any) => {

    const { isLogsOpen,
        changeLogs,
        setIsLogsOpen,
        dataAvailable,
        logsData,
        viewLimit,
        setInitial,
        setLimitFor,
        setChangeLogs,
        setDataAvailable,
        initail,
        limitFor } = props;


    return (
        <Cards className="invoice-logs">
            <Logs
                custom
                isOpen={isLogsOpen}
                data={changeLogs}
                title={
                    <>
                        <Icon
                            icon="edit"
                            size="small"
                            color="#526FD6"
                            viewBox="-2 -1 24 24"
                            style={{
                                marginTop: "0",
                                padding: "0",
                            }}
                        />{" "}
                        View Change Log
                    </>
                }
                name="View-change-log"
                handleUpDown={() => setIsLogsOpen(!isLogsOpen)}
                actions={{
                    primary: {
                        label: "View More",
                        icon: {
                            icon: "edit",
                            size: "small",
                            color: "#526FD6",
                            viewBox: "-2 -1 24 24",
                        },

                        handleOnClick: () => {
                            if (dataAvailable) {
                                const spliced = [...logsData].splice(
                                    changeLogs.length,
                                    viewLimit
                                );

                                if (logsData.length > limitFor) {
                                    setInitial(limitFor);
                                    setLimitFor(limitFor + 10);
                                }

                                setChangeLogs([...changeLogs, ...spliced]);
                            }
                        },
                        disabled: !dataAvailable,
                    },
                    secondary: {
                        label: "View Less",
                        icon: {
                            icon: "edit",
                            size: "small",
                            color: "#526FD6",
                            viewBox: "-2 -1 24 24",
                        },
                        handleOnClick: () => {
                            const logs = [...changeLogs];
                            logs.splice(initail, limitFor);
                            setChangeLogs([...logs]);
                            setInitial(initail - 10);
                            setLimitFor(initail);
                            if (logs.length === changeLogs.length) {
                                setDataAvailable(true);
                            }
                        },
                        disabled: changeLogs.length <= viewLimit,
                    },
                }}
            />
        </Cards>
    )
}


export default LogsCompo;