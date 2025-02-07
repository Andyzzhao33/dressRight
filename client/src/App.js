import React, {useEffect, useState} from 'react'

function App() {


  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setBackendData(data))
  }, [])
  return (
    <div>
      {backendData.message ? (
        backendData.message.map((msg, index) => (
          <h1 key={index}>{msg}</h1>
        ))
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default App
