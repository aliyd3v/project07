import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { supabaseBucketName, supabaseKey, supabaseUrl } from '../config/config.js'

const supabase = createClient(supabaseUrl, supabaseKey)

const storage = {
    upload: async (fileName, filePath) => {
        const { error } = await supabase.storage
            .from(supabaseBucketName)
            .upload(fileName, fs.readFileSync(filePath))
        if (error) return { error }
        const { data } = supabase.storage
            .from(supabaseBucketName)
            .getPublicUrl(fileName)
        return { errUpload: error, data }
    },
    delete: async fileName => {
        await supabase.storage
            .from(supabaseBucketName)
            .remove(fileName)
    }
}

export default storage