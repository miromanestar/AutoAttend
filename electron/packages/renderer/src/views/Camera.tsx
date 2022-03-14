import React, { useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
    root: {
        position: 'relative',
        width: '100%',
    },

    webcam: {
        width: '100%',
    },

    canvas: {
        position: 'absolute',
        left: 0
    }
})

const Camera = () => {
    const classes = useStyles()

    const webcamRef: any = useRef(null)
    const canvasRef: any = useRef(null)

    
    const beginDetection = async (stream: MediaStream) => {
        // console.log(canvas.width, canvas.height)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // const video = webcamRef.current.getScreenshot()
        // const canvas: any = faceapi.createCanvasFromMedia(video)
        // console.log(canvas)

        await faceapi.loadTinyFaceDetectorModel('/models')
        await faceapi.loadFaceLandmarkModel('/models')
        await faceapi.loadFaceExpressionModel('/models')
        await faceapi.loadFaceDetectionModel('./models')
    }

    useEffect(() => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const videoEl = document.querySelector(`.${classes.root} video`)

            const displaySize = { width: videoEl?.clientWidth || 0, height: videoEl?.clientHeight || 0 }
            faceapi.matchDimensions(canvasRef.current, displaySize)
            const resizedDetections: any = faceapi.resizeResults(detections, displaySize)

            faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
        }, 20)
    })

    return (
        <div className={classes.root}>
            <Webcam
                className={classes.webcam}
                audio={false}
                ref={webcamRef}
                onUserMedia={(stream) => beginDetection(stream)}
            />
            <canvas className={classes.canvas} ref={canvasRef} />
        </div >
    )
}

export default Camera