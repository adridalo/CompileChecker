import { useState } from "react"
import { determineLanguage } from "./utils"

function App() {

  const ACCEPTED_EXTENSIONS = [".c", ".cpp", ".cs", ".go", ".java", ".js", ".py", ".r", ".ts"]
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)
  const [compileStatus, setCompileStatus] = useState('')
  const [resetButtonVisibility, setResetButtonVisibility] = useState('none')

  const compile = async () => {
    if(selectedFile !== undefined) {
      setCompileStatus('Compiling...')
      const CODE_EVALUATION_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
      const CLIENT_SECRET = import.meta.env['VITE_CLIENT_SECRET']

      const fileContent = await selectedFile.text()

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
          setCompileStatus(`${fileUrl} compiled successfully in ${compile['result']['run_status']['time_used']} seconds!`)
        } else {
          setCompileStatus(`Code compilation failed: ${compile['result']['compile_status']}`)
        }
        reset()
      }
    }
  }

  const reset = () => {
    setResetButtonVisibility('block')
    document.getElementById('file-upload').remove()
    document.getElementById('compile-btn').remove()
    document.getElementById('upload-compile-br').remove()
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

      <div id="file-upload">
        <label>Select a file to upload for checking:
          <div>
            <input 
              type="file" 
              accept={ACCEPTED_EXTENSIONS} 
              onChange={e => {
                const file = e.target.files[0]
                setFileUrl(file.name)
                setSelectedFile(file)
              }}
            />
          </div>
        </label>
      </div>

      <br id="upload-compile-br"></br>

      <button id="compile-btn" onClick={compile}>Compile</button>
      <p>{compileStatus}</p>
      <button 
        style={{'display': resetButtonVisibility}}
        onClick={() => {
          window.location.reload()
        }}
      >
        Compile another file
      </button>
    </>
  )
}

export default App
