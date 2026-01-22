import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CoursePage = ({ user }) => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const navigate = useNavigate();

  // Fetch course by slug
  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/courses/${slug}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      setCourse(data.course || null);
    } catch (error) {
      console.error("Error fetching course:", error);
      setCourse(null);
    } finally {
      setLoadingCourse(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  // Add new topic
  const handleAddTopic = async () => {
    const topicTitle = prompt("Enter topic title");
    if (!topicTitle) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/courses/${course._id}/topics`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: topicTitle }),
        },
      );

      const data = await response.json();
      if (data.course) setCourse(data.course); // update course with populated topics
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  // Loading states
  if (loadingCourse) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;
  if (!user) return <p>Loading user...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate("/")}>Home</button>

      {/* Add Topic button for admin/instructor */}
      {["admin", "instructor"].includes(user.role) && (
        <button onClick={handleAddTopic} style={{ marginLeft: "1rem" }}>
          Add Topic
        </button>
      )}

      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h2>Topics</h2>
      {(course.topics || []).length === 0 ? (
        <p>No topics yet.</p>
      ) : (
        <ul>
          {(course.topics || []).map((topic) => (
            <li key={topic._id}>
              <Link to={`/topics/${topic._id}`}>{topic.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoursePage;
