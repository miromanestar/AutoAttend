import '@tensorflow/tfjs-node'
import * as faceapi from 'face-api.js'
import * as canvas from 'canvas'

import supabase from './supabase.js'
import testImages from '../assets/testImages.json'

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

faceapi.nets.ssdMobilenetv1.loadFromDisk('./src/assets/models')
faceapi.nets.faceLandmark68Net.loadFromDisk('./src/assets/models')
faceapi.nets.faceRecognitionNet.loadFromDisk('./src/assets/models')

const descriptors = (await supabase.from('Descriptor').select()).data

let catDescriptors = {}
descriptors.map(d => {
    const temp = catDescriptors[d.user]
    catDescriptors[d.user] = [...temp, d.descriptor]
})

console.log('Descriptors retrieved')

const createDescriptors = async () => {
    const data = testImages.map(async entry => {
        const image = await canvas.loadImage(entry.image)
        const desc = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
        return {
            user: entry.id,
            descriptor: desc
        }
    })

    await supabase.from('Descriptor').insert(data)
    return data
}

export {
    createDescriptors
}