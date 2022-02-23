import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import './App.css'

import '@tensorflow/tfjs'
import * as canvas from 'canvas'
import * as faceapi from 'face-api.js'

const mtcnnForwardParams = {
    minFaceSize: 200,
}

function App() {
    const [stream, setStream] = useState(null)
    const webcamRef = useRef(null)


    const options = new faceapi.MtcnnOptions()
    const faceDetection = async () => {
        console.log('Detections')
        await faceapi.loadMtcnnModel('/models')
        await faceapi.loadFaceDetectionModel('/models')
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
