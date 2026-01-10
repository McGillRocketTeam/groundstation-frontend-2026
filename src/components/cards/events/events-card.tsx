import type { Column, ColumnDef, CellContext, ColumnFiltersState, FilterFn } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

// shape of events from the yamcs backend
type YamcsEvent = {
  severity: string;
  createdBy: string;
  source: string;
  generationTime: string;
  receptionTime: string;
  seqNumber: number;
  message: string;
}

  // for sorting table based on generationTime and receptionTime
  type TimeFilter =
  | { type: "lastHour" }
  | { type: "last6Hours" }
  | { type: "last24Hours" }
  | { type: "noLimit" }
  | { type: "custom"; from: Date; to: Date };

  // for sorting table based on severity level
  type SeverityFilter =
  | { type: "Info" }
  | { type: "Watch" }
  | { type: "Warning" }
  | { type: "Distress" }
  | { type: "Critical" }
  | { type: "Severe" }

  // map of severity levels to corresponding colors
  const severityColors: Record<string, string> = {
    INFO: "text-yellow-600",
    WATCH: "text-[#ff9933]",
    WARNING: "text-[#ff6600]",
    DISTRESS: "text-[#990000]",
    CRITICAL: "text-[#cc0000]",
    SEVERE: "text-[#cc0000] font-bold",
  };

export function EventsCard() {
  const [events, setEvents] = useState<YamcsEvent[]>([]);

  // getting initial events from yamcs backend
  useEffect(() => {
    fetch("http://localhost:8090/api/archive/mqtt-frames/events?limit=50")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.events);
        setEvents(data.events);
      })
      .catch((error) => console.error("Error fetching initial events", error));
  }, []);

  // NEEDS WORK. NOT WORKING AS IS.
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8090/api/websocket");

    // called when the connection opens
    websocket.onopen = () => {
      // subscribing to the events stream
      websocket.send(
        JSON.stringify({
          type: "subscribe",
          resource: "events",
          instance: "mqtt-frames",
          processor: "realtime",
        }),
      );
    };

    // update events list each time a new event is retrieved from the backend
    websocket.onmessage = (e) => {
      // turn data into JSON object
      const result = JSON.parse(e.data);

      // update events list
      if (result.events) setEvents((prev) => [...result.events, ...prev]);
    };

    websocket.onerror = (err) => {
      console.error("Websocket error", err);
    };

    return;
    /*
        () => {
            websocket.close();
        };*/
  }, []);

  // function that returns whether the row should be displayed based on time
  const generationTimeFilter: FilterFn<YamcsEvent> = (
    row,
    columnId,
    filterValue: TimeFilter
  ) => {
    if (!filterValue || filterValue.type === "noLimit") return true;

    // timestamp of the row in milliseconds
    const rowTime = new Date(row.getValue<string>(columnId)).getTime();
    // current time in milliseconds
    const now = Date.now();

    // number of milliseconds in an hour
    const timeMultiplier = 60 * 60 * 1000;

    switch (filterValue.type) {
      case "lastHour":
        return rowTime >= now - 1 * timeMultiplier;

      case "last6Hours":
        return rowTime >= now - 6 * timeMultiplier;

      case "last24Hours":
        return rowTime >= now - 24 * timeMultiplier;

      case "custom":
        return (
          rowTime >= filterValue.from.getTime() &&
          rowTime <= filterValue.to.getTime()
        );

      default:
        return true;
    }
  };

  // function that returns whether the row should be displayed based on severity level
  const severityFilter: FilterFn<YamcsEvent> = (
    row,
    columnId,
    filterValue: SeverityFilter
  ) => {
    if (!filterValue || filterValue.type === "Info") return true;

    return filterValue.type.toUpperCase() === row.getValue<string>(columnId).toUpperCase();

  };

  function SeverityHeader({ column } : { column: Column<YamcsEvent, string> }) {
    const [open, setOpen] = useState(false);

    const severityLevels = ["Info", "Watch", "Warning", "Distress", "Critical", "Severe"];

    return (
      <div className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          className="bg-gray-200 text-left hover:text-gray-600"
        >
          Severity Level
        </button>

        {open && (
          <div className="absolute z-10 mt-2 rounded border bg-white p-2 shadow">
            <div className="flex flex-col gap-1 text-left">
              {severityLevels.map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    column.setFilterValue({ type: level })
                  }
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function GenerationTimeHeader({ column }: { column: Column<YamcsEvent, string> }) {
    // whether the popup is open
    const [open, setOpen] = useState(false);

    const initialDateState = { date: "", hour: "", minute: "", second: "" };

    const [from, setFrom] = useState(initialDateState);
    const [to, setTo] = useState(initialDateState);

    const buildDate = ({ date, hour, minute, second }: typeof from) =>
      new Date(`${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`);

    const timeFilters = [
      { label: "Last hour", type: "lastHour" },
      { label: "Last 6 hours", type: "last6Hours" },
      { label: "Last 24 hours", type: "last24Hours" },
      { label: "No limit", type: "noLimit" },
    ];

    // type = ("date" | "hour" | "minute" | "second")[]
    const timeFields: (keyof typeof from)[] = ["hour", "minute", "second"];

    const renderTimeInputs = (state: typeof from, setState: typeof setFrom) => (
      <div className="flex gap-1">
        <input
          type="date"
          value={state.date}
          onChange={(curInput) => setState({ ...state, date: curInput.target.value })}
          className="border px-1 text-xs"
        />
        {timeFields.map((field) => (
          <input
            key={field}
            type="number"
            placeholder={field.toUpperCase()[0].repeat(2)}
            min="0"
            max={field === "hour" ? 23 : 59}
            value={state[field]}
            onChange={(curInput) => setState({ ...state, [field]: curInput.target.value })}
            className="w-12 border px-1 text-xs"
          />
        ))}
      </div>
    );

    return (
      <div className="relative">
        <button
          onClick={() => setOpen((value) => !value)}
          className="bg-gray-200 text-left hover:text-gray-600"
        >
          Generation Time
        </button>

        {open && (
          <div className="absolute z-10 mt-2 rounded border bg-white p-2 shadow">
            <div className="flex flex-col gap-1">
              {timeFilters.map((filter) => (
                <button
                  key={filter.type}
                  className="text-left"
                  onClick={() => column.setFilterValue({ type: filter.type })}
                >
                  {filter.label}
                </button>
              ))}

              <div className="mt-2 border-t pt-2">
                <label className="text-xs">Custom range</label>
                <div className="mt-1">{renderTimeInputs(from, setFrom)}</div>
                <div className="mt-1">{renderTimeInputs(to, setTo)}</div>

                <button
                  className="mt-2 w-full border bg-gray-100"
                  onClick={() =>
                    column.setFilterValue({
                      type: "custom",
                      from: buildDate(from),
                      to: buildDate(to),
                    })
                  }
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CellContext<RowType, CellValueType>. Called with cell.getContext()
  const getCellValue = (props: CellContext<YamcsEvent, string>) => props.getValue();

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const columns: ColumnDef<YamcsEvent, string>[] = [
    {
      accessorKey: "severity",
      header: ({ column }) => <SeverityHeader column={column} />,
      cell: (props) => {
        const value = props.getValue();
        const colorClass = severityColors[value] || "text-black";
        return <span className={colorClass}>{value}</span>;
      },
      filterFn: severityFilter
    },
    {
      accessorKey: "generationTime",
      header: ({ column }) => (
        <GenerationTimeHeader column={column} />
      ),
      cell: getCellValue,
      filterFn: generationTimeFilter,
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: getCellValue,
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: getCellValue,
    },
  ];

  // TanStack table
  const eventsTable = useReactTable<YamcsEvent>({
    data: events,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // for debugging
  //console.log(events);
  console.log(eventsTable.getRowModel().rows);
  //console.log(eventsTable.getRowModel().rows[0]?.getVisibleCells());

  return (
    <div className="h-[500px] overflow-y-auto px-2 py-2 pb-8">
      <table className="w-full table-fixed border border-gray-500 text-xs">
        <thead className="bg-gray-200 text-left">
          {/* Note: There is only one header group right now with 4 headers */}
          {eventsTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-gray-500 px-2 py-2 break-words"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {eventsTable.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-gray-500 px-2 py-2 text-left align-top break-words"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}