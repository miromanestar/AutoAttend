import '@tensorflow/tfjs-node'
import * as faceapi from '@vladmandic/face-api'
import canvas from 'canvas'

import supabase from './supabase.js'
import testImages from '../assets/testImages.json'

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

faceapi.nets.ssdMobilenetv1.loadFromDisk('./src/assets/models')
faceapi.nets.faceLandmark68Net.loadFromDisk('./src/assets/models')
faceapi.nets.faceRecognitionNet.loadFromDisk('./src/assets/models')

const dbDescriptors = (await supabase.from('Descriptor').select()).data

let catDescriptors = {}
dbDescriptors.map(d => {
    const temp = catDescriptors[d.user_id]

    if (!d.descriptor)
        return
    catDescriptors[d.user_id] = temp ? [...temp, d.descriptor] : [d.descriptor]
})
let descriptorArr = Object.keys(catDescriptors).map(key => new faceapi.LabeledFaceDescriptors(key, catDescriptors[key]))
console.log('Descriptors retrieved')


const createDescriptors = async () => {
    const results = await Promise.all(testImages.map(async entry => {
        const image = await canvas.loadImage(entry.image)
        const desc = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()

        return {
            user_id: entry.id,
            descriptor: desc.descriptor
        }
    }))

    return await supabase.from('Descriptor').insert(results)
}

const matchDescriptors = async (descriptors) => {
    return await Promise.all(descriptors.map(async descriptor => {
        const matches = await faceapi.matchDimensions(canvas, descriptor.descriptor)
        const res = await faceapi.findFaceMatches(matches, catDescriptors)

        return {
            user: descriptor.user,
            matches: res
        }
    }))
}

export {
    createDescriptors,
    matchDescriptors
}