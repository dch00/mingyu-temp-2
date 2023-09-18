import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/appcontext";
import Modal from "../components/modal";

const ROUTES = [{ to: "/sessions", title: "Sessions" }];

export default function Navbar() {
  let { currentUser, logout, pendingSessions } = useContext(AppContext);
  let [show, setShow] = useState(false);

  function closeDropdown() {
    const selected = document.activeElement;
    if (selected) selected.blur();
  }
  let [sessions, setSessions] = useState([]);
  useEffect(() => {
    if (!currentUser) return;
    setSessions(pendingSessions(currentUser.user_id));
  }, [currentUser, pendingSessions]);

  return (
    <div className="w-full flex justify-center bg-base-200">
      <div className="navbar max-w-6xl pr-5">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
          </div>
          <Link to="/" className="normal-case text-xl btn font-bold">
            TutorFinder
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            {currentUser && (
              <>
                <div className="indicator">
                  {sessions.length > 0 && (
                    <span className="indicator-item rounded-full badge-sm badge-warning mr-2 mt-2"></span>
                  )}
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img alt="propic" src={currentUser.profile_picture} />
                    </div>
                  </label>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li onClick={closeDropdown}>
                    <Link to={`/profile/${currentUser.user_id}`}>Profile</Link>
                  </li>
                  {ROUTES.map((route) => (
                    <li key={route.title} onClick={closeDropdown}>
                      <Link to={route.to}>{route.title}</Link>
                    </li>
                  ))}
                  <li
                    onClick={() => {
                      closeDropdown();
                      logout();
                    }}
                  >
                    <button>Logout</button>
                  </li>
                </ul>
              </>
            )}
            {!currentUser && (
              <button
                onClick={() => setShow(true)}
                className="btn btn-sm btn-outline btn-primary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <Login show={show} setShow={setShow} />
    </div>
  );
}

function Login({ show, setShow }) {
  let { login } = useContext(AppContext);
  let [email, setEmail] = useState("spikespugle@btreecode.com");
  let [password, setPassword] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    login(email, password, setShow);
    setEmail("");
    setPassword("");
  }

  return (
    <Modal show={show} setShow={setShow}>
      <form className="flex flex-col items-center" onSubmit={onSubmit}>
        <div className="font-bold text-xl mb-5">Sign In</div>
        <input
          value={email}
          placeholder="email"
          onChange={(ev) => setEmail(ev.target.value)}
          className="input input-sm input-secondary mb-2"
          type="email"
        />

        <input
          value={password}
          placeholder="password"
          onChange={(ev) => setPassword(ev.target.value)}
          className="input input-sm input-secondary mb-5"
          type="password"
        />
        <div>
          <button className="btn btn-sm btn-success">Login</button>
        </div>
      </form>
    </Modal>
  );
}
