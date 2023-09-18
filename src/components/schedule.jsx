import { AppContext } from "../utils/appcontext";
import {
  getTimezone,
  convertFromUtc,
  convertToUtc,
  toString
} from "../utils/timezone";
import { useContext, useEffect, useState } from "react";
import Modal from "../components/modal";
import { WEEKDAYS, TIMES } from "../utils/time";

export default function Schedule({ user }) {
  let {
    currentUser,
    updateUser,
    sessions,
    subjectsMap,
    addSession
  } = useContext(AppContext);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [enable, setEnable] = useState("0");
  const [availability, setAvailability] = useState(
    convertFromUtc(user.availability)
  );
  const [update, setUpdate] = useState(false);
  const [request, setRequest] = useState(false);
  const [requestStart, setRequestStart] = useState(-1);
  const [requestEnd, setRequestEnd] = useState(-1);

  let currentUserAvailability = currentUser
    ? convertFromUtc(currentUser.availability)
    : undefined;

  const [finalAvailability, setFinalAvailability] = useState(
    new Array(336).fill("0")
  );

  useEffect(() => {
    let utcArray = convertToUtc(availability);
    let userSessions = sessions.filter(
      (s) =>
        s.status === 1 &&
        (s.tutor_id === parseInt(user.user_id, 10) ||
          s.student_id === parseInt(user.user_id, 10))
    );

    userSessions.forEach((s) => {
      for (let i = s.start; i <= s.end; i++) {
        utcArray[i] = "" + s.session_id;
      }
    });
    setFinalAvailability(convertFromUtc(utcArray));
  }, [sessions, availability, user]);

  // --- CELL FUNCTIONS ---

  function onDragStart(ev) {
    ev.preventDefault();
  }

  function onMouseDown(row, col) {
    if (request) {
      requestMouseDown(row, col);
      return;
    }
    let pos = 48 * col + row;

    if (
      currentUser?.user_id !== parseInt(user.user_id, 10) ||
      (finalAvailability[pos] !== "0" && finalAvailability[pos] !== "1")
    )
      return;
    setSelectedCol(col);
    setEnable(availability[pos] === "0" ? "1" : "0");
    setAvailability((availability) =>
      [...availability].map((v, i) => (i === pos ? (v === "0" ? "1" : "0") : v))
    );
    setMouseDown(true);
    setUpdate(true);
  }

  function requestMouseDown(row, col) {
    let pos = 48 * col + row;

    if (currentUser === undefined || finalAvailability[pos] !== "1") return;

    if (requestStart === -1) {
      setRequestStart(pos);
      setRequestEnd(pos);
    } else if (
      requestStart - 1 !== requestEnd &&
      (pos === requestStart - 1 ||
        (pos === availability.length - 1 && requestStart === 0))
    )
      setRequestStart(pos);
    else if (
      requestEnd + 1 !== requestStart &&
      (pos === requestEnd + 1 ||
        (pos === 0 && requestEnd === availability.length - 1))
    )
      setRequestEnd(pos);
    setMouseDown(true);
  }

  function onMouseUp() {
    if (request) {
      requestMouseUp();
      return;
    }
    if (currentUser?.user_id !== parseInt(user.user_id, 10)) return;
    setMouseDown(false);
    setSelectedCol(-1);
  }

  function requestMouseUp() {
    if (currentUser === undefined) return;
    setMouseDown(false);
  }

  function onMouseEnter(row, col) {
    let pos = 48 * col + row;

    if (request) {
      requestMouseEnter(row, col);
      return;
    }
    if (
      currentUser?.user_id !== parseInt(user.user_id, 10) ||
      !mouseDown ||
      col !== selectedCol ||
      (finalAvailability[pos] !== "1" && finalAvailability[pos] !== "0")
    )
      return;
    setAvailability((availability) =>
      [...availability].map((v, i) => (i === pos ? enable : v))
    );
  }

  function requestMouseEnter(row, col) {
    let pos = 48 * col + row;

    if (
      currentUser === undefined ||
      !mouseDown ||
      finalAvailability[pos] !== "1"
    )
      return;

    if (
      requestStart - 1 !== requestEnd &&
      (pos === requestStart - 1 ||
        (pos === availability.length - 1 && requestStart === 0))
    )
      setRequestStart(pos);
    else if (
      requestEnd + 1 !== requestStart &&
      (pos === requestEnd + 1 ||
        (pos === 0 && requestEnd === availability.length - 1))
    )
      setRequestEnd(pos);
  }

  function requestedCell(row, col) {
    if (!request) return false;
    let pos = 48 * col + row;
    if (requestStart > requestEnd) {
      return (
        (requestStart <= pos && pos < availability.length) ||
        (0 <= pos && pos <= requestEnd)
      );
    } else {
      return requestStart <= pos && pos <= requestEnd;
    }
  }

  // ----------------------

  return (
    <div className="w-full  text-center text-xs flex flex-col items-center pb-2">
      {currentUser && currentUser?.user_id !== parseInt(user.user_id, 10) && (
        <Request
          request={request}
          setRequest={setRequest}
          requestStart={requestStart}
          setRequestStart={setRequestStart}
          requestEnd={requestEnd}
          setRequestEnd={setRequestEnd}
          subjectsMap={subjectsMap}
          currentUser={currentUser}
          user={user}
          addSession={addSession}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-center py-2 space-x-2 items-center">
        {currentUser?.user_id === parseInt(user.user_id, 10) && (
          <div className="space-x-2 pb-2 sm:pb-0">
            {update && (
              <button
                onClick={() =>
                  updateUser(user.user_id, {
                    availability: toString(convertToUtc(availability, false))
                  })
                }
                className="btn btn-xs"
              >
                Update
              </button>
            )}
            <button
              onClick={() => {
                setUpdate(true);
                setAvailability(
                  finalAvailability.map((v) => (v !== "1" ? v : "0"))
                );
              }}
              className="btn btn-xs"
            >
              Clear
            </button>
          </div>
        )}
        <div className="flex space-x-2">
          {currentUser && (
            <div className="flex space-x-1">
              <div className="border h-4 w-8 bg-primary" />
              <div>Match</div>
            </div>
          )}
          <div className="flex space-x-1">
            <div className="border h-4 w-8 bg-warning" />
            <div>Booked</div>
          </div>
          <div className="flex space-x-1">
            <div className="border h-4 w-8 bg-secondary" />
            <div>Available</div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-16">
          <div className="pb-2 font-bold">{getTimezone()}</div>
          {TIMES.map((t, i) => (
            <div key={i} className="h-8 flex justify-end items-start pr-2">
              {t}
            </div>
          ))}
        </div>
        <div>
          <div
            className="grid grid-cols-8"
            onMouseLeave={() => {
              if (currentUser?.user_id !== parseInt(user.user_id, 10)) return;
              setMouseDown(false);
              setSelectedCol(-1);
            }}
          >
            {WEEKDAYS.map((_, col) => (
              <div key={col}>
                <div className="pb-2">
                  {WEEKDAYS[col].substring(0, 3).toUpperCase()}
                </div>
                {new Array(48).fill(0).map((_, row) => (
                  <Cell
                    key={row}
                    row={row}
                    col={col}
                    onDragStart={onDragStart}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseEnter={onMouseEnter}
                    value={finalAvailability[48 * col + row]}
                    currentValue={
                      currentUserAvailability
                        ? currentUserAvailability[48 * col + row]
                        : undefined
                    }
                    requestedCell={requestedCell}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Request({
  requestStart,
  setRequestStart,
  requestEnd,
  setRequestEnd,
  request,
  setRequest,
  subjectsMap,
  currentUser,
  user,
  addSession
}) {
  let [show, setShow] = useState(false);
  let [subject, setSubject] = useState("-1");
  let [message, setMessage] = useState("");

  let weekday = requestStart !== -1 && WEEKDAYS[Math.floor(requestStart / 48)];
  let start =
    requestStart !== -1 &&
    (requestStart % 2 === 0
      ? TIMES[(requestStart % 48) / 2]
      : TIMES[Math.floor((requestStart % 48) / 2)].replace("00", "30"));
  let end =
    requestEnd !== -1 &&
    (requestEnd % 2 !== 0
      ? TIMES[Math.floor((requestEnd % 48) / 2 + 1) % 48]
      : TIMES[Math.floor((requestEnd % 48) / 2)].replace("00", "30"));

  function sendRequest() {
    let session = {
      student_id: currentUser.user_id,
      subject_id: parseInt(subject, 10),
      tutor_id: user.user_id,
      start: requestStart,
      end: requestEnd,
      request: message,
      status: 0
    };
    setRequest(false);
    setRequestStart(-1);
    setRequestEnd(-1);
    setShow(false);
    addSession(session);
  }
  return (
    <div className="space-x-2 pt-2">
      {!request && (
        <button
          className={`btn btn-xs ${request && "btn-success"}`}
          onClick={() => setRequest(true)}
        >
          request
        </button>
      )}
      {request && (
        <>
          <button
            disabled={requestStart === -1}
            className="btn btn-xs btn-success"
            onClick={() => {
              setShow(true);
            }}
          >
            send request
          </button>
          <button
            className="btn btn-xs btn-warning"
            onClick={() => {
              setRequestStart(-1);
              setRequestEnd(-1);
            }}
          >
            reset
          </button>
          <button
            className="btn btn-xs btn-error"
            onClick={() => {
              setRequestStart(-1);
              setRequestEnd(-1);
              setRequest(false);
            }}
          >
            cancel
          </button>
        </>
      )}
      <Modal show={show} setShow={setShow}>
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold">Request Session</div>
          <div className="text-sm italic mb-5">
            @{weekday}: {start} ~ {end}
          </div>
          <select
            className="select-success select select-sm mb-5"
            value={subject}
            onChange={(ev) => setSubject(ev.target.value)}
          >
            <option value={-1}>Choose Subject</option>
            {user.subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subjectsMap.get(subject).subject}
              </option>
            ))}
          </select>
          <textarea
            placeholder="How can I help you?"
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            className="textarea textarea-success mb-5"
          ></textarea>
          <button
            disabled={subject === "-1" || message.length === 0}
            className="btn btn-success btn-sm"
            onClick={sendRequest}
          >
            Send Request
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Cell({
  row,
  col,
  value,
  currentValue,
  onDragStart,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  requestedCell
}) {
  return (
    <div
      onDragStart={onDragStart}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseUp={onMouseUp}
      onMouseEnter={() => onMouseEnter(row, col)}
      className={`h-4 w-8 sm:w-16 border-l 
                  ${row === 0 && "border-t"} 
                  ${row % 2 !== 0 && "border-b"}
                  ${col === 6 && "border-r"}
                  ${
                    requestedCell(row, col)
                      ? "bg-success"
                      : value !== "1" && value !== "0"
                      ? "bg-warning"
                      : value === "1"
                      ? currentValue === "1"
                        ? "bg-primary"
                        : "bg-secondary"
                      : ""
                  }`}
    />
  );
}
