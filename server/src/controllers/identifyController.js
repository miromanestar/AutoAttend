import supabase from '../services/supabase.js'
import send from '../tools/send.js'
import { matchDescriptors } from '../services/recognition.js'

export const getIndex = async (req, res) => {
    send(res, { message: 'API for matching face descriptors'})
}

export const postIndex = async (req, res) => {
    const { descriptors } = req.body
    const { data, error } = await matchDescriptors(descriptors)

    send(res, { data, error })
}