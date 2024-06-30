import { useEffect, useState } from "react";
import "./App.css";
import { IoPersonCircleSharp } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { BiLoader } from "react-icons/bi";

const App = () => {
  const [person, setPerson] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPerson = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      setPerson(data);
      if (data.length > 0) {
        await fetchUserDetails(data[0].id, "photos");
        setSelectedUserId(data[0].id);
        setShowUserDetails(true);
        setActiveSection("photos");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (userId, section) => {
    try {
      setIsLoading(true);
      let detailsData;
      if (section === "todos") {
        const todosRes = await fetch(
          `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
        );
        detailsData = await todosRes.json();
      } else if (section === "photos") {
        const photosRes = await fetch(
          `https://jsonplaceholder.typicode.com/photos?albumId=${userId}`
        );
        detailsData = await photosRes.json();
      }
      setUserDetails({
        section,
        data: detailsData,
      });
    } catch (error) {
      console.error(`Error fetching ${section} for user ${userId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDetailsClick = async (userId, section) => {
    if (selectedUserId === userId) {
      setShowUserDetails((prevState) => !prevState);
    } else {
      setSelectedUserId(userId);
      setShowUserDetails(true);
      setActiveSection(section);
      await fetchUserDetails(userId, section);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  return (
    <div className="App">
      <header>
        <div className="container">
          <div className="header-all">
            <h1>
              USERS <IoPersonCircleSharp />
            </h1>
          </div>
        </div>
      </header>
      {isLoading ? (
        <div className="loading">
          <BiLoader />
          <h1>LOADING...</h1>
        </div>
      ) : (
        <main className="main-container container justify-content-around">
          <div className="container">
            <div className="cards">
              {person.map((user) => (
                <div className="card" key={user.id}>
                  <div className="card-header">
                    <div className="imgs">
                      <IoPersonCircleSharp />
                      <MdOutlineSettings />
                    </div>
                    <div className="line"></div>
                    <div className="titles">
                      <h2>#ID: {user.id}</h2>
                      <h2>#Name: {user.name}</h2>
                      <h2>#Username: {user.username}</h2>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="btns">
                      <button
                        onClick={() => handleUserDetailsClick(user.id, "todos")}
                      >
                        USER TODOS
                      </button>
                      <button
                        onClick={() =>
                          handleUserDetailsClick(user.id, "photos")
                        }
                      >
                        GALLERY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showUserDetails && userDetails.section && (
            <div className="details-section">
              <div className="container">
                <div className="user-details">
                  {userDetails.section === "todos" &&
                    userDetails.data &&
                    userDetails.data.length > 0 && (
                      <div className="todos-section">
                        <ul>
                          {userDetails.data.map((todo) => (
                            <div className="todos-card" key={todo.id}>
                              <strong>Posts:</strong> <span>{todo.userId}</span>{" "}
                              <br /> <strong>Title:</strong>{" "}
                              <span>{todo.title}</span>
                            </div>
                          ))}
                        </ul>
                      </div>
                    )}
                  {userDetails.section === "photos" &&
                    userDetails.data &&
                    userDetails.data.length > 0 && (
                      <div className="gallery-section">
                        <div className="row">
                          {userDetails.data.map((photo) => (
                            <div key={photo.id} className="col-3 gallery-item">
                              <img
                                className="galry-photo"
                                src={photo.url}
                                alt={photo.title}
                              />
                              <div className="gallery-text">
                                <p>
                                  Album Id: <span>{photo.albumId}</span>
                                </p>
                                <p>
                                  Title: <span>{photo.title}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
