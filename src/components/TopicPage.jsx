import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TopicPage = ({ user, fetchUser }) => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/topics/${topicId}/lessons`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      setLessons(data.lessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLessons([]);
    }
  };

  const fetchTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/topics/${topicId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      setTopic(data.topic || null);
    } catch (error) {
      console.error("Error fetching topic:", error);
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  //   const handleNewLesson = async () => {
  //     const lessonTitle = prompt("Enter lesson title");

  //   }

  useEffect(() => {
    fetchTopic();
    fetchUser();
    fetchLessons();
  }, [topicId]);

  if (loading) return <p>Loading topic...</p>;
  if (!topic) return <p>Topic not found</p>;

  return (
    <div style={{ padding: "1rem" }}>
      {["instructor", "admin"].includes(user.role) && (
        <button>New Lesson</button>
      )}
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>{topic.title}</h1>
      {(lessons || []).map((lesson, index) => (
        <li key={index}>
          <Link to={`/lessons/${lesson._id}`}>{lesson.title}</Link>
        </li>
      ))}
      <h2>Lessons</h2>
      {topic.lessons.length === 0 && <p>No lessons found</p>}
    </div>
  );
};

export default TopicPage;
