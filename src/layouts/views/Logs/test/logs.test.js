
import { fireEvent, render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import LogsCompo from "../index";
import { changeLogs, logsData } from "./mockdata";


describe("View Change Log", () => {
    test("View Change Log", () => {
        render(
            <HashRouter>
                <LogsCompo
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></LogsCompo>
            </HashRouter>
        );
        var viewLog = screen.getByText("View Change Log")
        fireEvent.click(viewLog);
    })

    test("View Change Log", () => {
        render(
            <HashRouter>
                <LogsCompo
                    isLogsOpen={true}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={true}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></LogsCompo>
            </HashRouter>
        );
        var viewLog = screen.getByText("View Change Log")
        fireEvent.click(viewLog);
    })

    test("View More", () => {
        render(
            <HashRouter>
                <LogsCompo
                    isLogsOpen={true}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={true}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></LogsCompo>
            </HashRouter>
        );
        var viewLog = screen.getByText("View Change Log")
        fireEvent.click(viewLog);

        const viewMoreText = screen.getByText("View More");
        fireEvent.click(viewMoreText);
        fireEvent.click(viewMoreText);
        fireEvent.click(viewMoreText);
    })

    test("View Less", () => {
        render(
            <HashRouter>
                <LogsCompo
                    isLogsOpen={true}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={true}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></LogsCompo>
            </HashRouter>
        );
        var viewLog = screen.getByText("View Change Log")
        fireEvent.click(viewLog);

        const viewMoreText = screen.getByText("View More");
        fireEvent.click(viewMoreText);
        fireEvent.click(viewMoreText);
        fireEvent.click(viewMoreText);

        screen.logTestingPlaygroundURL();

        const viewLessText = screen.getByText("View Less");
        fireEvent.click(viewLessText);
    })
})