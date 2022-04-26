import crypto from 'crypto'
import supabase from '../services/supabase.js'
import milvus from '../services/milvus.js'
import { createDescriptors } from '../services/recognition.js'

export const getUsers = async (req, res) => {
    const query = req.query.query

    if (!query) {
        const payload = await supabase.from('User').select().order('name')
        res.json(payload.data)
    } else {
        
        const payload = await supabase.rpc('search_users', { 
            keyword: query instanceof Array ? query.join(' & ') : query
        })

        res.json(payload.data)
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('User').select().eq('id', id)
    res.json(payload.data)
}

export const createUser = async (req, res) => {
    const data = req.body

    const user = {
        name: data.name,
        email: data.email,
        role: data.role,
        registered: new Date().toISOString(),
    }

    const response = await supabase.from('User').insert([user])
    res.json(response)
}

export const updateUser = async (req, res) => {
    const { id } = req.params
    const data = req.body

    const response = await supabase.from('User')
        .update({
            ...data
        })
        .eq('id', id)

    res.json(response)
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    const response = await supabase.from('User').delete().eq('id', id)
    res.json(response)
}

// USER IMAGES
export const getUserImages = async (req, res) => {
    const id = req.params.id
    const response = await supabase.from('UserImage').select().eq('user_id', id)
    res.json(response.data)
}

export const createUserImage = async (req, res) => {
    const { id } = req.params
    const data = req.body

    const entityId = crypto.randomInt(10000000, 100000000) //Random 8-byte number
    const response = await supabase.from('UserImage').insert([{
        id: entityId,
        user_id: id,
        url: data.image_url,
    }])

    res.json(response)
}

export const createUserDescriptors = async (req, res) => {
    const { id } = req.params
    const data = req.body

    const response = await supabase.from('UserImage').select().eq('user_id', id)
    const images = response.data

    const ids = images.map(i => i.id)

    const milvusRes = await milvus.dataManager.query({
        collection_name: 'faces',
        expr: `id not in [${ids.join(',')}]`,
        output_fields: ['id'],
    })

    const oldMilvusIds = milvusRes.data.map(r => r.id)

    await milvus.dataManager.deleteEntities({
        collection_name: 'faces',
        expr: `id in [${oldMilvusIds.join(',')}]`,
    })

    const newIds = ids.filter(el => !oldMilvusIds.includes(el))
    const filteredImages = images.filter(i => newIds.includes(i.id))
    const finalRes = await createDescriptors(filteredImages)

    res.json(finalRes)
}

export const deleteUserImages = async (req, res) => {
    const id = req.params.id
    const response = await supabase.from('UserImage').delete().eq('user_id', id)
    res.json(response)
}

export const deleteUserImage = async (req, res) => {
    const { id, imageId } = req.params
    const response = await supabase.from('UserImage')
        .delete()
        .eq('user_id', id)
        .eq('id', imageId)
    res.json(response)
}