import { useEffect, useState } from "react"
import { determineLanguage } from "./utils"

function App() {

  const ACCEPTED_EXTENSIONS = [".c", ".cpp", ".cs", ".go", ".java", ".js", ".py", ".r", ".ts"]
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)
  const [compileStatus, setCompileStatus] = useState('')

  const compile = async () => {
    if(selectedFile !== undefined) {
      setCompileStatus('Compiling...')
      const CODE_EVALUATION_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
      const CLIENT_SECRET = import.meta.env['VITE_CLIENT_SECRET']

      const fetchedFile = await fetch(selectedFile)
      const fileContent = await fetchedFile.text()

      const data = {
        source: fileContent,
        lang: determineLanguage(fileUrl),
        id: import.meta.env['VITE_CLIENT_ID']
      }
      const headers = { 
        'client-secret': CLIENT_SECRET,
        'Content-Type': 'application/json'
      }

      const evaluationResponse = await fetch(CODE_EVALUATION_URL, {
        headers: headers,
        body: JSON.stringify(data),
        method: 'POST'
      })

      if(evaluationResponse.ok) {
        const evaluation = await evaluationResponse.json()
        const evaluationUrl = evaluation['status_update_url']

        const compileResponse = await fetch(evaluationUrl, {
          headers: headers,
          method: 'GET'
        })

        const compile = await compileResponse.json()
        if(compile['result']['compile_status'] === 'OK') {
          setCompileStatus(`Code compilation succeeded in ${compile['result']['run_status']['time_used']} seconds!`)
        } else {
          setCompileStatus(`Code compilation failed: ${compile['result']['compile_status']}`)
        }
      }
    }
  }

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

      <button onClick={compile}>Compile</button>
      <p>{compileStatus}</p>
    </>
  )
}

export default App
