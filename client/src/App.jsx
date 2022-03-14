import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import './App.css'

import '@tensorflow/tfjs'
import * as canvas from 'canvas'
import * as faceapi from 'face-api.js'

//https://levelup.gitconnected.com/do-not-laugh-a-simple-ai-powered-game-3e22ad0f8166

const mtcnnForwardParams = {
    minFaceSize: 200,
}

function App() {
    const [stream, setStream] = useState(null)
    const webcamRef = useRef(null)


    const options = new faceapi.MtcnnOptions()
    
    const faceDetection = async () => {
        console.log('Mtcnn')
        const model = await faceapi.loadMtcnnModel('src/public/models')
        console.log(model)
        console.log('DetectionModel')
        await faceapi.loadFaceDetectionModel('./models')
    }

    useEffect(() => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(webcamRef.current.video, options)
        }, 20)
    }, [])
    return (
        <div className="App">
            <Webcam
                audio={false}
                ref={webcamRef}
                onUserMedia={() => faceDetection()}
            />
        </div>
    )
}

export default App
