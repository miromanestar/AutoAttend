import supabase from '../services/supabase.js'
import send from '../tools/send.js'

export const getUsers = async (req, res) => {
    const query = req.query.query

    if (!query) {
        const payload = await supabase.from('User').select()
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
    send(res, payload)
}