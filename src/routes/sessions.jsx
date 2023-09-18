import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/appcontext";
import Session from "../components/session";
import Loading from "../components/loading";

export default function Sessions() {
  let { currentUser, sessions, loading, setLoading } = useContext(AppContext);

  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    if (currentUser === undefined) return;
    setLoading(true);
    setApproved(
      sessions.filter(
        (session) =>
          (currentUser.user_id === session.tutor_id ||
            currentUser.user_id === session.student_id) &&
          session.status === 1
      )
    );
    setPending(
      sessions.filter(
        (session) =>
          (currentUser.user_id === session.tutor_id ||
            currentUser.user_id === session.student_id) &&
          session.status === 0
      )
    );
    setRejected(
      sessions.filter(
        (session) =>
          (currentUser.user_id === session.tutor_id ||
            currentUser.user_id === session.student_id) &&
          session.status === 2
      )
    );
  }, [currentUser, sessions, setLoading]);

  if (currentUser === undefined)
    return (
      <div className="flex-grow flex justify-center items-center">
        Please login to view this page.
      </div>
    );

  if (loading) return <Loading />;

  return (
    <div className="flex-grow w-full flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {approved.length === 0 &&
          pending.length === 0 &&
          rejected.length === 0 && <div>No sessions</div>}
        {approved.length > 0 && (
          <div className="flex flex-col items-center mb-3">
            <div className="max-w-xl w-full bg-success text-center my-2 font-bold py-2 rounded">
              Approved
            </div>
            {approved.map((session) => (
              <Session key={session.session_id} session={session} />
            ))}
          </div>
        )}
        {pending.length > 0 && (
          <div className="flex flex-col items-center mb-3">
            <div className="max-w-xl w-full bg-warning text-center my-2 font-bold py-2 rounded">
              Pending
            </div>
            {pending.map((session) => (
              <Session key={session.session_id} session={session} />
            ))}
          </div>
        )}
        {rejected.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="max-w-xl w-full bg-error text-center my-2 font-bold py-2 rounded">
              Rejected
            </div>
            {rejected.map((session) => (
              <Session key={session.session_id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
