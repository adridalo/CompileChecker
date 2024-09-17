import { useEffect, useState } from "react"
import { determineLanguage } from "./utils"

function App() {

  const ACCEPTED_EXTENSIONS = [".c", ".cpp", ".cs", ".go", ".java", ".js", ".py", ".r", ".ts"]
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)

  useEffect(() => {
    if(selectedFile !== undefined) {
      const CODE_EVALUATION_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
    }
  }, [selectedFile])

  return (
    <>
      <h1>Compile Checker</h1>
      <p>Supported Languages:</p>
      <ul>
        <li>C</li>
        <li>C++ 17</li>
        <li>C#</li>
        <li>Golang</li>
        <li>Java 14</li>
        <li>JavaScript</li>
        <li>Python 3</li>
        <li>R</li>
        <li>TypeScript</li>
      </ul>

      <label>Select a file to upload for checking:
        <div>
          <input 
            type="file" 
            accept={ACCEPTED_EXTENSIONS} 
            onChange={e => {
              const file = e.target.files[0]
              if(file) {
                const fileContent = URL.createObjectURL(file)
                setSelectedFile(fileContent)
                setFileUrl(file.name)
              }
            }}
          />
        </div>
      </label>

      <br></br>

      <button>Compile</button>
    </>
  )
}

export default App
