import "./ImageLinkForm.css"

const ImageLinkForm = ({ onInputChange, onSubmit }) => {
  const onFormSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={onFormSubmit} id="image-link-form">
      <p className="f4 mt-6 text-white backdrop-blur-sm w-fit mx-auto">
        {"This Magic Brain will detect faces in your pictures. Give it a try!"}
      </p>
      <div
        id="search-div"
        className="sm:w-full md:w-3/5  mx-auto my-6 shadow-xl p-2 backdrop-blur-sm w-fit"
      >
        <div className="m-2 flex justify-center" autoComplete="off">
          {/* Search Field */}
          <input
            id="search-field"
            type="text"
            placeholder="Paste Image Address"
            className="p-2 mr-1 text-gray-600 w-3/4"
            onChange={onInputChange}
          />
          {/* Detect Button */}
          <button
            type="submit"
            className="white pointer p-2 m-auto w-1/4 bg-blue-400 hover:text-white hover:bg-[#da59da] ease-in duration-200"
          >
            Detect
          </button>
        </div>
      </div>
    </form>
  )
}

export default ImageLinkForm
