import React, { useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from '@vladmandic/face-api'
import nearestVector from 'ml-nearest-vector';
import { createUseStyles } from 'react-jss'
import Axios from '../tools/Axios'

const useStyles = createUseStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%',
    },

    webcam: {
        width: '100%',
        borderRadius: theme.radius[2]
    },

    canvas: {
        position: 'absolute',
        left: 0
    }
}))

const Camera = ({ idents, isRunning, modelLoaded }) => {
    const classes = useStyles()

    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const isRunningRef = useRef(false)
    const firstRun = useRef(true)
    const framerate = useRef({ fr: 0, count: 0})
    const currentDetections = useRef([])
    const recogs = useRef([])

    const timers = useRef([])
    const intervals = useRef([])

    const doRecognition = async () => {
        if (currentDetections.current.length === 0) {
            const t = setTimeout(() => {
                doRecognition()
            }, 300)

            timers.current.push(t)
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

        idents(recogs.current)

        const timer = setTimeout(() => {
            doRecognition()
        }, 300)
        timers.current.push(timer)
    }

    const doDetection = async () => {
        if (webcamRef.current && isRunningRef.current) {
            const detections = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors()
            if (firstRun.current) {
                firstRun.current = false
                console.log('Detection models compiled')
            }

            modelLoaded()
            
            const videoEl = webcamRef.current.video
            const displaySize = { width: videoEl?.clientWidth || 0, height: videoEl?.clientHeight || 0 }
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            currentDetections.current = resizedDetections
        }

        framerate.current.count++
    }

    const beginDetection = () => {
        console.log('Camera started')
        
        const timer = setTimeout(async () => {
            await doDetection()
            
            doRecognition()

            const interval = setInterval(async () => {
                await doDetection()
            }, 33)

            intervals.current.push(interval)
        }, 300)

        timers.current.push(timer)
    }

    const drawStuff = () => {
        if (!isRunningRef.current) {
            recogs.current = []
            currentDetections.current = []
        }

        const ctx = canvasRef.current.getContext('2d')

        const recs = recogs.current
        const dets = currentDetections.current

        const videoEl = webcamRef.current.video
        const displaySize = { width: videoEl?.clientWidth || 0, height: videoEl?.clientHeight || 0 }
        faceapi.matchDimensions(canvasRef.current, displaySize)

        recs?.length > 0 && recs.forEach((bestMatch, _i) => {
            if (!bestMatch.descriptor)
                return
            const index = nearestVector(currentDetections.current.map(d => Array.from(d.descriptor)), bestMatch.descriptor)
            if (!dets[index])
                return
            
            const box = dets[index].detection.box
            const text = `${bestMatch.label} (${bestMatch.score.toFixed(2)})`
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvasRef.current)
        })

        ctx.font = '30px Arial'
        ctx.fillStyle = '#000'
        ctx.fillText(`${framerate.current.fr} FPS`, 10, 30)
    }

    useEffect(() => {        
        (async () => { 
            await faceapi.loadSsdMobilenetv1Model('/models')
            await faceapi.loadFaceLandmarkModel('/models')
            await faceapi.loadFaceDetectionModel('./models')
            await faceapi.loadFaceRecognitionModel('./models')

            console.log('Models loaded')

        })()

        console.log('Loading models...')

        const frCounter = setInterval(() => {
            framerate.current.fr = framerate.current.count
            framerate.current.count = 0
        }, 1000)

        const drawInterval = setInterval(() => {
            drawStuff()
        }, 16)

        intervals.current.push(frCounter, drawInterval)

        return () => {
            intervals.current.forEach(i => clearInterval(i))
            timers.current.forEach(t => clearTimeout(t))
        }
    }, [])

    useEffect(() => {
        isRunningRef.current = isRunning

        if (!isRunning)
            return

        console.log('Beginning detection')

    }, [isRunning])

    return (
        <div className={classes.root}>
            <Webcam
                className={classes.webcam}
                audio={false}
                ref={webcamRef}
                onUserMedia={(_stream) => beginDetection()}
            />
            <canvas className={classes.canvas} ref={canvasRef} />
        </div >
    )
}

export default Camera