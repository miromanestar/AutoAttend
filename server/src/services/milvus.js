import { MilvusClient } from '@zilliz/milvus2-sdk-node'

let milvus = null

try {
    milvus = new MilvusClient(process.env.MILVUS_URL)
} catch (e) {
    console.error('Could not connect to Milvus', e)
}

const params = {
    collection_name: 'faces',
    description: 'Collection of face descriptors',
    auto_id: true,
    fields: [
        {
            name: 'id',
            is_primary_key: true,
            data_type: 5,
        },
        {
            name: 'user_id',
            data_type: 2
        },
        {
            name: 'descriptor',
            data_type: 101,
            type_params: {
                dim: "128"
            }
        },
    ]
}

const hasFacesCollection = await milvus.collectionManager.hasCollection({ collection_name: 'faces'})
await milvus.collectionManager.createCollection(params)

export default milvus