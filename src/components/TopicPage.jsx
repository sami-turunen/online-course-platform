import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const TopicPage = ({ user, fetchUser }) => {
  const { topicId } = useParams(); // Id of the topic
  const [topic, setTopic] = useState(null); // Topic data
  const [loading, setLoading] = useState(true); // Loading state
  const [lessons, setLessons] = useState([]); // Lessons data
  const navigate = useNavigate(); // Navigation

  // Fetch lessons from backend
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

  // Fetch topic from backend
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

  // Handle adding a new lesson
  const handleNewLesson = async () => {
    const lessonTitle = prompt("Enter lesson title");
    const lessonContent = prompt("Enter lesson content");
    try {
      const response = await fetch(`http://localhost:3000/api/lessons`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          topic: topicId,
          topicId: topicId,
        }),
      });
      const data = await response.json();
      console.log("Lesson created:", data);
      fetchLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  // Fetch user, topic and lessons when topicId changes
  useEffect(() => {
    fetchTopic();
    fetchUser();
    fetchLessons();
  }, [topicId]);

  if (loading) return <p>Loading...</p>; // Display loading message when data is being fetched
  if (!topic) return <p>Topic not found</p>; // Display error message in case topic is not found

  return (
    <div style={{ padding: "1rem" }}>
      {/* Button to add a new lesson, visible to instructors and admins */}
      {["instructor", "admin"].includes(user.role) && (
        <button onClick={handleNewLesson}>New Lesson</button>
      )}
      {/* Button to go back one page */}
      <button onClick={() => navigate(-1)}>Go Back</button>{" "}
      <h1>{topic.title}</h1> {/* Topic title */}
      {/* Render list of lessons */}
      {(lessons || []).map((lesson, index) => (
        <li key={index}>
          <Link to={`/lessons/${lesson._id}`}>{lesson.title}</Link>
        </li>
      ))}
      <h2>Lessons</h2>
      {/* If no lessons, display message */}
      {topic.lessons.length === 0 && <p>No lessons found</p>}
    </div>
  );
};

export default TopicPage;
