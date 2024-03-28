import React, { useState} from "react";

const Rank = ({ name, entries, faceCount }) => {
    const [count, setCount] = useState(faceCount);
  
    // Update count state whenever faceCount changes
    React.useEffect(() => {
      setCount(faceCount);
    }, [faceCount]);
  
    return (
      <div>
        <div className="white f3 w-fit m-auto backdrop-blur-sm">
          {`Hello ${name}, your current entry count is:`}
        </div>
        <div className="white f1 w-fit m-auto backdrop-blur-sm">
          {entries}
        </div>
        <div className="white f3 w-fit m-auto backdrop-blur-sm">
          {`Number of detected faces: ${count}`} {/* Display count dynamically */}
        </div>
      </div>
    );
  };
  
  export default Rank;