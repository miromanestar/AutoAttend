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
    const payload = await supabase.from('Event').select().eq('id', id)
    send(res, payload)
}

export const createEvent = async (req, res) => {
    const data = req.body
    console.log(data.scheduled)
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