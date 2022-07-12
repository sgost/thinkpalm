import React from "react";
import {
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

    const changeLogsFilter = changeLogs.filter((e: any) => e.description !== '' && changeLogs);

    return (
        <Cards className="invoice-logs">
            <Logs
                custom
                isOpen={isLogsOpen}
                data={changeLogsFilter}
                title="View Change Log"
                name="View-change-log"
                handleUpDown={() => setIsLogsOpen(!isLogsOpen)}
                actions={{
                    primary: {
                        label: "View More",
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