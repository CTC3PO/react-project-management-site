import "./Create.css";

import { useState, useEffect } from "react";
import Select from "react-select";

import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";

import { timestamp } from "../../firebase/config";

const category = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  //get the users collection from firestore
  const { documents } = useCollection("users");

  const [users, setUsers] = useState([]);
  const { user } = useAuthContext();

  //states
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  //useEffect to map through each user of the documents,
  //to get value and label for each user
  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  //handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    //reset error to null everytime we submit
    setFormError(null);

    //handle error if user doesn't select a category or assigned user
    if (!category) {
      setFormError("please select a project category");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("please assign project to at least 1 user");
      return;
    }

    //createdBy and assignedUsersList to be recorded into each project
    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const assignedUsersList = assignedUsers.map((user) => {
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id,
      };
    });

    //project
    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy: createdBy,
      assignedUsersList,
    };

    console.log(project);
  };

  //return
  return (
    <div className="create-form">
      <h2 className="page-title">Create a New Project</h2>
      <form>
        <label>
          <span>Project name: </span>
          <input
            required
            type="text"
            onChange={() => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Details: </span>
          <input
            required
            type="text"
            onChange={() => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label>
          <span>Due date: </span>
          <input
            required
            type="date"
            onChange={() => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category: </span>
          <Select
            onChange={(option) => setCategory(option)}
            options={category}
          />
        </label>
        <label>
          <span>Assign to: </span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>

        <button className="btn">Add Project</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
