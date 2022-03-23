import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getDescriptors = async (req, res) => {
    const payload = await supabase.from('Descriptor').select('id, descriptor, User (name)')
    send(res, payload)
}

export const getDescriptor = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Descriptor').select('id, descriptor, User (name)').eq('id', id)
    send(res, payload)
}