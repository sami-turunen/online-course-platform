import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Courses = ({ user, fetchUser }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/courses", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Courses fetched:", data);
      setCourses(data);
      console.log(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCourses();
  }, []); // Removed `courses` to avoid infinite loop

  if (!user) return <p>Loading user data...</p>;

  const handleCreateCourse = async () => {
    const courseTitle = prompt("Enter course title");
    const courseDescription = prompt("Enter course description");

    try {
      const response = await fetch("http://localhost:3000/api/courses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
        }),
      });
      const data = await response.json();
      console.log("Course created:", data);

      // Option A: refetch all courses
      fetchCourses();

      // Option B: add new course directly
      // setCourses(prev => [...prev, data.course]);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <>
      <button onClick={() => navigate("/")}>Home</button>
      {["admin", "instructor"].includes(user.role) && (
        <button onClick={handleCreateCourse}>Create Course</button>
      )}
      <h1>Courses</h1>
      {courses.map((course) => {
        const slug = course.title.toLowerCase().replace(/\s+/g, "-");
        return (
          <div
            key={course._id}
            style={{
              border: "1px solid white",
              padding: "1rem",
              margin: "1rem",
              cursor: "pointer",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={() => navigate(`/courses/${slug}`)}
          >
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>
        );
      })}
    </>
  );
};

export default Courses;
