import React, { Component } from "react"
import "./App.css"
import Navigation from "./components/Navigation/Navigation"
import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import Rank from "./components/Rank/Rank"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import ParticlesBg from "particles-bg"
import SignIn from "./components/SignIn/SignIn"
import Register from "./components/Register/Register"
import Scoreboard from "./components/Scoreboard/Scoreboard"
const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
  faceCount: 0,
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      },
      isSignedIn: true
    });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage")
    const width = Number(image.width)
    const height = Number(image.height)
    return JSON.parse(data, null, 2).outputs[0].data.regions.map((face) => {
      const clarifaiFace = face.region_info.bounding_box
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      }
    })
  }

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
    // Update faceCount state based on the number of boxes (detected faces)
    this.setState({ faceCount: boxes.length }, () => {
      console.log("Number of detected faces:", this.state.faceCount);
    });

  };


  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    const raw = JSON.stringify({
      user_app_id: {
        user_id: "clarifai",
        app_id: "main",
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    })

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key dc909b76df6646348782f475407e883b",
      },
      body: raw,
    }

    fetch(
      `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        this.displayFaceBox(this.calculateFaceLocation(result))
        if (result) {
          console.log("User's name:", this.state.user.name);
          fetch("http://localhost:3001/image", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: this.state.user.name, // Pass the user's name

            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to update user entries');
              }
              return response.json();
            })
            .then((count) => {
              this.setState(prevState => ({
                user: { ...prevState.user, entries: count }
              }));
            })
            .catch((error) => {
              console.error("Error updating user entries:", error);
            });
        }
      })
      .catch((error) => console.log("error", error))
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state
    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={100} type="cobweb" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
              faceCount={this.state.faceCount}
            />

            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </>
            ) : route === "scoreboard" ? (
              <Scoreboard />
        ) : route !== "register" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    )
  }
}

export default App
