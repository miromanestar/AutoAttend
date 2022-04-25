import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getEvents = async (req, res) => {
    const query = req.query.query

    if (query === '') {
        const payload = await supabase.from('Event').select()
        res.json(payload.data)
    } else {
        
        const payload = await supabase.rpc('search_events', { 
            keyword: query instanceof Array ? query.join(' & ') : query
        })

        res.json(payload.data)
    }
}

export const getEvent = async (req, res) => {
    const id = req.params.id
    const payload = await supabase.from('Event').select('*, User!Event_owner_fkey(name, id)').eq('id', id)
    send(res, payload)
}

export const createEvent = async (req, res) => {
    const data = req.body

    const event = {
        name: data.name,
        host: data.owner_name,
        description: data.description,
        owner: data.owner_id,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        scheduled: new Date(data.scheduled).toISOString(),
        status: 'scheduled'
    }

    const response = await supabase.from('Event').insert([event])
    res.json(response)
}

export const editEvent = async (req, res) => {
    const { id } = req.params
    const data = req.body
    console.log(data)
    const response = await supabase.from('Event')
        .update({ 
            ...data, 
            modified: new Date().toISOString() 
        })
        .eq('id', id)

    res.json(response)
}

export const deleteEvent = async (req, res) => {
    const { id } = req.params
    const response = await supabase.from('Event').delete().eq('id', id)
    res.json(response)
}