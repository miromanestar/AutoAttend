import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getIdentifications = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Identification').select().eq('event_id', id)
    send(res, payload)
}

export const getIdentification = async (req, res) => {
    const { id, identificationId } = req.params
    const payload = await supabase.from('Identification').select().eq('event_id', id).eq('id', identificationId)

    send(res, payload)
}