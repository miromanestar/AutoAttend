import React, { useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from '@vladmandic/face-api'
import nearestVector from 'ml-nearest-vector';
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

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

const MAX_FRAMERATE = 60

const Camera = () => {
    const classes = useStyles()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const framerate = useRef({ fr: 0, count: 0})
    const currentDetections = useRef([])
    const recogs = useRef([])

    const doRecognition = async () => {
        //console.log(currentDetections.current)
        if (currentDetections.current.length === 0) {
            setTimeout(() => {
                doRecognition()
            }, 300)
            return
        }

        const resizedDetections = currentDetections.current

        const res = await Axios.post('/identify', { 
            detections: resizedDetections.map(d => Array.from(d.descriptor)),
        }).catch(e => {
            console.error(e)
        })

        const results = res?.data || []

        recogs.current = results.map((r, i) => {
            if (r.score > 0.3)
                return {
                    user_id: 'Unknown',
                    label: 'Unknown',
                    score: r.score,
                    descriptor: resizedDetections[i].descriptor
                }

            return {
                id: r.id,
                user_id: r.user_id,
                score: r.score,
                label: r.label,
                descriptor: resizedDetections[i].descriptor,
            }
        })
        // results?.length > 0 && results.forEach((bestMatch, i) => {
        //     const box = resizedDetections[i].detection.box
        //     const text = `${bestMatch._label} (${bestMatch._distance.toFixed(2)})`
        //     const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        //     drawBox.draw(canvasRef.current)
        // })

        setTimeout(() => {
            doRecognition()
        }, 300)
    }

    const doDetection = async () => {

        const detections = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors()
        const videoEl = webcamRef.current.video
        const displaySize = { width: videoEl?.clientWidth || 0, height: videoEl?.clientHeight || 0 }
        faceapi.matchDimensions(canvasRef.current, displaySize)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        currentDetections.current = resizedDetections
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

        recogs.current?.length > 0 && recogs.current.forEach((bestMatch, i) => {
            if (!bestMatch.descriptor)
                return
            const index = nearestVector(currentDetections.current.map(d => Array.from(d.descriptor)), bestMatch.descriptor)
            if (!resizedDetections[index])
                return
            const box = resizedDetections[index].detection.box
            const text = `${bestMatch.label} (${bestMatch.score.toFixed(2)})`
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvasRef.current)
        })

        framerate.current.count++
        let ctx = canvasRef.current.getContext('2d')
        ctx.font = '30px Arial'
        ctx.fillStyle = '#000'
        ctx.fillText(`${framerate.current.fr} FPS`, 10, 30)

    }

    const beginDetection = () => {
        console.log('Camera started')
        
        setTimeout(async () => {
            console.log('Beginning detection')
            await doDetection()
            doRecognition()
            while (true)
                await doDetection()
        }, 300)
    }

    useEffect(() => {
        
        (async () => { 
            await faceapi.loadSsdMobilenetv1Model('/models')
            await faceapi.loadFaceLandmarkModel('/models')
            await faceapi.loadFaceDetectionModel('/models')
            await faceapi.loadFaceRecognitionModel('/models')

            console.log('Models loaded')

        })()

        console.log('Loading models...')

        setInterval(() => {
            framerate.current.fr = framerate.current.count
            framerate.current.count = 0
        }, 1000)
    }, [])

    return (
        <div className={classes.root}>
            <Webcam
                className={classes.webcam}
                audio={false}
                ref={webcamRef}
                onUserMedia={(stream) => beginDetection()}
                // videoConstraints={{
                //     frameRate: { max: 20 },
                // }}
            />
            <canvas className={classes.canvas} ref={canvasRef} />
        </div >
    )
}

export default Camera