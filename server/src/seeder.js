import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'


const db = createClient(process.env.SERVER_URL, process.env.ANON_KEY)

const { data, error } = await db.from('test').insert('test')
console.log(data)