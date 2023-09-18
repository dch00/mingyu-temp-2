import { USERS } from "../data/users";
import { SUBJECTS } from "../data/subjects";
import { SESSIONS } from "../data/sessions";
import { useEffect, useMemo, useState } from "react";
import { convertTime } from "../utils/timezone";

export default function useData() {
  // data
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  // misc
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);

  // sorting
  const [rating, setRating] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // processed data
  const subjectsMap = useMemo(
    () => new Map(subjects.map((s) => [s.subject_id, s])),
    [subjects]
  );
  const sortedUsers = useMemo(() => {
    return [...users]
      .filter(
        (user) =>
          selectedIds.length === 0 ||
          selectedIds.some((s) => user.subjects.includes(s))
      )
      .sort((a, b) =>
        rating
          ? a.rating === b.rating
            ? b.last_active - a.last_active
            : b.rating - a.rating
          : b.last_active - a.last_active
      );
  }, [users, rating, selectedIds]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    let timerId = setInterval(() => {
      setUsers(USERS);
      setSubjects(SUBJECTS);
      setSessions(SESSIONS);
      setLoading(false);
      return clearInterval(timerId);
    }, Math.floor(Math.random() * 1000) + 500);
  }

  // functions

  function login(email, password, setShow) {
    email = email.toLowerCase();
    let user = users.find((u) => u.email.toLowerCase() === email);
    setCurrentUser(user);
    setShow(false);
  }

  function logout() {
    setCurrentUser(undefined);
  }

  function updateUser(user_id, data) {
    if (!currentUser || currentUser.user_id !== parseInt(user_id, 10)) return;
    setUsers((users) =>
      users.map((u, i) =>
        u.user_id === parseInt(user_id, 10) ? { ...u, ...data } : u
      )
    );
    setCurrentUser({ ...currentUser, ...data });
  }

  function updateSession(session_id, data) {
    if (!currentUser) return;
    setSessions((sessions) =>
      sessions.map((s, i) =>
        s.session_id === session_id ? { ...s, ...data } : s
      )
    );
  }

  function addSession(session) {
    session.start = convertTime(true, session.start);
    session.end = convertTime(true, session.end);
    for (let i = 2; i < 3 + sessions.length; i++) {
      let r = sessions.find((s) => s.session_id === i);
      if (r === undefined) {
        setSessions([...sessions, { ...session, session_id: i }]);
        return;
      }
    }
  }

  function deleteSession(session_id) {
    setSessions(sessions.filter((s) => s.session_id !== session_id));
  }

  function pendingSessions(user_id) {
    return sessions.filter((s) => s.tutor_id === user_id && s.status === 0);
  }

  return {
    currentUser,
    subjects,
    subjectsMap,
    users,
    updateUser,
    sortedUsers,
    login,
    logout,
    loading,
    setLoading,
    sessions,
    setSessions,
    addSession,
    updateSession,
    deleteSession,
    pendingSessions,
    selectedIds,
    setSelectedIds,
    rating,
    setRating
  };
}
