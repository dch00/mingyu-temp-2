import { SUBJECTS } from "./subjects";

const data = [
  {
    name: "Sarah Johnson",
    profile_picture:
      "https://images.unsplash.com/photo-1586448983330-d03f696c8271?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHN0dWRlbnR8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Michael Smith",
    profile_picture:
      "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80"
  },
  {
    name: "Emily Chen",
    profile_picture:
      "https://images.unsplash.com/photo-1619431470767-41b32d2de451?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHN0dWRlbnR8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Daniel Lee",
    profile_picture:
      "https://images.unsplash.com/photo-1545696968-1a5245650b36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2632&q=80"
  },
  {
    name: "Sophia Wang",
    profile_picture:
      "https://images.unsplash.com/photo-1514355315815-2b64b0216b14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fHN0dWRlbnR8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "John Adams",
    profile_picture:
      "https://images.unsplash.com/photo-1601392561050-340745ba9c25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHN0dWRlbnR8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Olivia Brown",
    profile_picture:
      "https://images.unsplash.com/photo-1517256673644-36ad11246d21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
  },
  {
    name: "William Taylor",
    profile_picture:
      "https://images.unsplash.com/photo-1492462543947-040389c4a66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
  },
  {
    name: "Ava Martinez",
    profile_picture:
      "https://images.unsplash.com/photo-1529470839332-78ad660a6a82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Ethan Anderson",
    profile_picture:
      "https://images.unsplash.com/photo-1511551203524-9a24350a5771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
  }
];

function createUser(index) {
  let nr = Math.floor(Math.random() * 500 + 1);
  let ratings = new Array(6).fill(0);
  let t = nr;
  for (let i = ratings.length - 1; i > -1; i--) {
    let r = Math.floor(Math.random() * (t + 1));
    ratings[i] = r;
    t -= r;
  }

  let sum = Math.floor(
    ratings.reduce((sum, cnt, i) => {
      return sum + cnt * i;
    }, 0)
  );

  let subjects = new Array(SUBJECTS.length)
    .fill(false)
    .map((v, i) => (Math.random() < 0.3 ? SUBJECTS[i].subject_id : v))
    .filter((s) => s !== false);

  let availability = new Array(336).fill("0");

  for (let i = 0; i < availability.length; i++) {
    let r = Math.floor(Math.random() * Math.min(availability.length - i, 10));
    for (let j = i; j < i + r; j++) {
      availability[j] = "1";
    }
    i += r * 4;
  }
  availability = availability.join("");

  let email = data[index].name.split(" ").join("") + "@btreecode.com";

  return {
    user_id: index + 1,
    rating: Math.round(sum / nr),
    ratings: nr,
    name: data[index].name,
    profile_picture: data[index].profile_picture,
    last_active: new Date().setDate(
      new Date().getDate() - Math.floor(Math.random() * 60)
    ),
    subjects,
    availability,
    email,
    user_type: 1
  };
}

const USERS = [
  ...new Array(data.length).fill(0).map((_, i) => createUser(i)),
  {
    user_id: data.length + 1,
    rating: 4,
    ratings: 50,
    name: "Spike Spugle",
    profile_picture:
      "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHB1Z3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    last_active: new Date(),
    subjects: [1, 2, 3],
    availability: new Array(336).fill("1").join(""),
    email: "SpikeSpugle@btreecode.com",
    user_type: 1
  }
];

export { USERS };
