import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/appcontext";
import { WEEKDAYS, TIMES } from "../utils/time";
import Modal from "./modal";

export default function Session({ session }) {
  let {
    currentUser,
    subjectsMap,
    users,
    updateSession,
    deleteSession
  } = useContext(AppContext);

  const [tutor, setTutor] = useState(undefined);
  const [student, setStudent] = useState(undefined);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(undefined);

  useEffect(() => {
    setTutor(users.find((u) => u.user_id === session.tutor_id));
    setStudent(users.find((u) => u.user_id === session.student_id));
  }, [currentUser, users, session]);

  let weekday = WEEKDAYS[Math.floor(session.start / 48)];
  let start =
    session.start !== -1 &&
    (session.start % 2 === 0
      ? TIMES[(session.start % 48) / 2]
      : TIMES[Math.floor((session.start % 48) / 2)].replace("00", "30"));
  let end =
    session.end !== -1 &&
    (session.end % 2 !== 0
      ? TIMES[Math.floor((session.end % 48) / 2 + 1) % 48]
      : TIMES[Math.floor((session.end % 48) / 2)].replace("00", "30"));

  if (tutor === undefined || student === undefined) return <></>;

  return (
    <div className="w-full">
      <div className="bg-slate-100 border rounded shadow-lg p-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div
              className="h-12 w-12 rounded-full bg-center bg-cover"
              style={{ backgroundImage: `url(${student.profile_picture})` }}
            />
            <div>
              <div>
                <div className="font-bold">{student.name}</div>
                <div
                  className={`badge badge-sm sm:badge-md badge-primary
              }`}
                >
                  {subjectsMap.get(session.subject_id).subject}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm italic">
              @{weekday}: {start}-{end}
            </div>
            {session.status === 0 && (
              <div>
                {session.tutor_id === currentUser.user_id && (
                  <>
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => setShow(1)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => setShow(2)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {session.student_id === currentUser.user_id && (
                  <>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => setShow(2)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
            {session.status === 1 && (
              <div>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => setShow(2)}
                >
                  Cancel
                </button>
              </div>
            )}
            {session.status === 2 && (
              <div>
                <button
                  onClick={() =>
                    updateSession(session.session_id, {
                      status: 1,
                      response: ""
                    })
                  }
                  className="btn btn-xs btn-success"
                >
                  Restore
                </button>
                <button
                  onClick={() => deleteSession(session.session_id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap bg-base-100 p-2">{session.request}</div>
        {session.status !== 0 && (
          <div
            className={`flex flex-wrap bg-base-100 p-2 ${
              session.status === 1 ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {session.response}
          </div>
        )}
      </div>
      <Modal show={show} setShow={setShow}>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            if (message.length === 0) return;
            updateSession(session.session_id, {
              status: show,
              response: message
            });
            setShow(undefined);
          }}
          className="flex flex-col items-center space-y-5"
        >
          <div className="font-bold text-xl">Response</div>
          <textarea
            className="textarea textarea-primary"
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
          ></textarea>
          <button className="btn btn-sm btn-primary">Submit</button>
        </form>
      </Modal>
    </div>
  );
}
