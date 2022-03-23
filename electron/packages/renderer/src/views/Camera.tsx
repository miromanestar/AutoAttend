import React, { useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from '@vladmandic/face-api'
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

const MAX_FRAMERATE = 60

const Camera = () => {
    const classes = useStyles()

    const webcamRef: any = useRef(null)
    const canvasRef: any = useRef(null)
    const framerate: any = useRef({ fr: 0, count: 0})

    let temp: any = null

    const doDetection = async () => {
        if (framerate.current.count >= MAX_FRAMERATE)
            return

        const detections = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors()
            
        const videoEl = webcamRef.current.video
        const displaySize = { width: videoEl?.clientWidth || 0, height: videoEl?.clientHeight || 0 }
        faceapi.matchDimensions(canvasRef.current, displaySize)
        const resizedDetections: any = faceapi.resizeResults(detections, displaySize)

        faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
        //faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)

        const matcher = new faceapi.FaceMatcher(temp, 0.6)
        const results = resizedDetections.map((d: any) => matcher.findBestMatch(d.descriptor))
        
        results.forEach((bestMatch: any, i: any) => {
            const box = resizedDetections[i].detection.box
            const text = bestMatch.toString()
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvasRef.current)
        })

        framerate.current.count++
        let ctx = canvasRef.current.getContext('2d')
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

            const img = await faceapi.fetchImage('https://media-exp1.licdn.com/dms/image/C4D03AQGg2lhu0LMXrA/profile-displayphoto-shrink_800_800/0/1589210134416?e=1652918400&v=beta&t=pXyID_PClzCQQavvyyzaL0Bn3ubd4cPKojACc9Rm40Q')
            const desc = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!desc)
                throw new Error('No face detected')

            temp = new faceapi.LabeledFaceDescriptors('Miro', [desc.descriptor])

            console.log('Models loaded')
            setTimeout(async () => { 
                console.log('Beginning detection')
                
                while (true)
                    await doDetection()
            }, 300)
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
                onUserMedia={(stream) => console.log('Camera started')}
                // videoConstraints={{
                //     frameRate: { max: 20 },
                // }}
            />
            <canvas className={classes.canvas} ref={canvasRef} />
        </div >
    )
}

export default Camera