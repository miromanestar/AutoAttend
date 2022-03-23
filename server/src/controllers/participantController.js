import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getParticipants = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Participant').select().eq('event_id', id)
    send(res, payload)
}

export const getParticipant = async (req, res) => {
    const { id, participantId } = req.params
    const payload = await supabase.from('Participant').select().eq('event_id', id).eq('id', participantId)
    send(res, payload)
}