import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getUsers = async (req, res) => {
    const payload = await supabase.from('User').select()
    send(res, payload)
}

export const getUser = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('User').select().eq('id', id)
    send(res, payload)
}