import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getEvents = async (req, res) => {
    const payload = await supabase.from('Event').select()
    send(res, payload)
}

export const getEvent = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Event').select().eq('id', id)
    send(res, payload)
}