import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getParticipants = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Participant').select('id, modified, present, User (name)').eq('event_id', id)
    res.send(payload)
}

export const getParticipant = async (req, res) => {
    const { id, participantId } = req.params
    const payload = await supabase.from('Participant').select().eq('event_id', id).eq('id', participantId)
    send(res, payload)
}

export const addParticipant = async (req, res) => {
    const { id } = req.params
    const data = req.body
    const participant = {
        event_id: id,
        id: data.user_id,
        present: false,
        modified: new Date().toISOString()
    }
    const response = await supabase.from('Participant').insert([participant])
    res.json(response)
}

export const deleteParticipants = async (req, res) => {
    const id = req.params.id
    const response = await supabase.from('Participant').delete().eq('event_id', id)
    res.json(response)
}

export const deleteParticipant = async (req, res) => {
    const { id, participantId } = req.params
    const response = await supabase.from('Participant').delete().eq('event_id', id).eq('id', participantId)
    res.json(response)
}