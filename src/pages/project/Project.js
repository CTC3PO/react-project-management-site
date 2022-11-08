import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";

//styles, components
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";
import "./Project.css";

export default function Project() {
  //get the id for each project/document
  const { id } = useParams();
  const { error, document } = useDocument("projects", id);

  //another way to return error (without putting it as
  //{error} in return in main div)
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document} />
    </div>
  );
}
