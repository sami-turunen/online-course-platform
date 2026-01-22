import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Courses = ({ user, fetchUser }) => {
  const [courses, setCourses] = useState([]); // Courses state
  const navigate = useNavigate(); // Navigation

  // Fetch courses from backend
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

  // Fetch user and courses on mount
  useEffect(() => {
    fetchUser();
    fetchCourses();
  }, []);

  if (!user) return <p>Loading user data...</p>; // Show loading message while user data is being fetched

  // Handle course creation
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

      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <>
      {/* Navigate to home */}
      <button onClick={() => navigate("/")}>Home</button>
      {/* Course creation button for admins and instructors */}
      {["admin", "instructor"].includes(user.role) && (
        <button onClick={handleCreateCourse}>Create Course</button>
      )}
      <h1>Courses</h1>
      {/* Render list of courses */}
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
            {/* Render course title and description */}
            <h2>{course.title}</h2>
            <p>{course.description}</p>
          </div>
        );
      })}
    </>
  );
};

export default Courses;
