import '@tensorflow/tfjs-node'
import * as faceapi from '@vladmandic/face-api'
import canvas from 'canvas'

import supabase from './supabase.js'
import milvus from './milvus.js'
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
    const floatArr = Float32Array.from(d.descriptor)

    if (!d.descriptor)
        return

    catDescriptors[d.user_id] = temp ? [...temp, floatArr] : [floatArr]
})

let descriptorArr = Object.keys(catDescriptors).map(key => new faceapi.LabeledFaceDescriptors(key, catDescriptors[key]))
console.log('Descriptors retrieved')

const matcher = new faceapi.FaceMatcher(descriptorArr, 0.6)


const createDescriptors = async () => {
    const results = await Promise.all(testImages.map(async entry => {
        const image = await canvas.loadImage(entry.image)
        const desc = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()

        return {
            id: Math.random() * 1000000000000,
            user_id: entry.id,
            descriptor: [ ...desc.descriptor ]
        }
    }))

    await milvus.dataManager.insert({
        collection_name: 'faces',
        fields_data: results
    })

    const index_params = {
        metric_type: 'L2',
        index_type: 'FLAT'
    }

    await milvus.indexManager.createIndex({
        collection_name: 'faces',
        field_name: 'descriptor',
        extra_params: index_params
    })

    return await milvus.dataManager.flushSync({ collection_names: ['faces'] })

    //return await supabase.from('Descriptor').insert(results)
}


await milvus.collectionManager.loadCollection({
    collection_name: 'faces',
})

const matchDescriptors = async (data) => {
    const { detections } = data
    if (!detections)
        return []

    let res = await milvus.dataManager.search({
        collection_name: 'faces',
        vectors: detections,
        search_params: {
            anns_field: 'descriptor',
            topk: '1',
            metric_type: 'L2',
            params: '{}'
        },
        vector_type: 101,
        output_fields: ['id', 'user_id']
    })

    return await Promise.all(res.results.map(async r => {
        const user = await supabase.from('User').select().eq('id', r.user_id)
        return {
            score: r.score,
            id: r.id,
            user_id: r.user_id,
            label: user?.data[0]?.name || 'Unknown'
        }
    }))
    
    // const temp = detections.map(detection => matcher.findBestMatch(detection))
    // console.log(temp)
    // return temp
}

export {
    createDescriptors,
    matchDescriptors
}