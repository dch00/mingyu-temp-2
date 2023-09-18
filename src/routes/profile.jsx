import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../utils/appcontext";
import Schedule from "../components/schedule";
import SubjectFilter from "../components/subject-filter";
import Loading from "../components/loading";

export default function Profile() {
  const { user_id } = useParams();
  let {
    users,
    currentUser,
    subjectsMap,
    selectedIds,
    updateUser,
    loading,
    setLoading
  } = useContext(AppContext);
  let [user, setUser] = useState(undefined);
  let [show, setShow] = useState(false);

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    setUser(users.find((u) => u.user_id === parseInt(user_id, 10)));
  }, [user_id, users, setLoading]);

  function updateSubjects(selected) {
    let data = { subjects: selected };
    updateUser(currentUser.user_id, data);
  }

  if (loading) return <Loading />;

  return (
    <div className="flex-grow w-full flex flex-col items-center ">
      {user && (
        <>
          <div className="w-full flex justify-center bg-neutral">
            <div
              className="bg-cover bg-center h-48 sm:h-96 w-full max-w-6xl bg-base-300 flex flex-col justify-end items-center border-b-2 border-neutral"
              style={{
                backgroundImage: `url(${
                  subjectsMap.get(
                    user.subjects[
                      Math.floor(Math.random() * user.subjects?.length)
                    ]
                  )?.img
                })`
              }}
            >
              <div
                className={`${
                  currentUser &&
                  currentUser.user_id === user.user_id &&
                  "tooltip"
                } flex justify-center items-end bg-cover bg-center mx-5 h-24 w-24 sm:h-48 sm:w-48 rounded-full relative border border-2 shadow-lg border-neutral top-12 sm:top-24`}
                style={{
                  backgroundImage: `url(${user.profile_picture})`
                }}
                data-tip="toggle tutor status"
                onClick={() =>
                  updateUser(user.user_id, {
                    user_type: user.user_type === 0 ? 1 : 0
                  })
                }
              >
                {user.user_type === 1 && (
                  <div className="cursor-pointer badge-sm sm:badge-lg badge-warning relative -bottom-2">
                    Tutor
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center bg-neutral sm:h-24">
            <div className="max-w-6xl w-full flex flex-col items-center justify-between">
              <div className="flex justify-center w-full">
                <div className="w-2/5 flex sm:justify-end font-bold text-white text-left pl-2">
                  {user.name}
                </div>
                <div className="sm:w-48 w-24 mx-5" />
                <div className="w-2/5 text-lg text-warning font-bold flex items-end sm:items-center flex-col sm:flex-row pr-2">
                  <div className="flex">
                    {new Array(user.rating).fill("★")}
                    {new Array(5 - user.rating).fill("☆")}
                  </div>
                  <div className="ml-1 badge badge-sm badge-warning flex">
                    {user.ratings}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center bg-neutral pt-3 sm:pt-2 ">
            <div className="flex flex-wrap items-center px-1">
              {user.subjects.map((subject) => (
                <div
                  key={subjectsMap.get(subject).subject_id}
                  className={`badge mr-1 mb-1 badge-sm sm:badge-lg ${
                    selectedIds.includes(subject)
                      ? "badge-primary"
                      : "badge-secondary"
                  }`}
                >
                  {subjectsMap.get(subject).subject}
                </div>
              ))}
              {currentUser?.user_id === parseInt(user_id, 10) && (
                <button
                  onClick={() => setShow(true)}
                  className="mb-1 badge badge-sm sm:badge-lg badge-accent"
                >
                  Set Subjects
                </button>
              )}
            </div>
          </div>
          <div className="w-full max-w-6xl flex justify-center">
            <Schedule availability={user.availability} user={user} />
          </div>
          <SubjectFilter
            show={show}
            setShow={setShow}
            subjects={user.subjects}
            onApply={updateSubjects}
          />
        </>
      )}
    </div>
  );
}
